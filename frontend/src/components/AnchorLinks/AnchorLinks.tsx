import React, { FC, ReactNode, useEffect, useState } from 'react';
import { ScrollLink } from '@components';
import { isAtEndOfPage, isElementInView } from '@utils';
import clsx from 'clsx';

export interface AnchorLinkItem {
    label: string;
    // provide the id of the target, or a query selector
    target: string;
    offset?: number;
}

export type ControlledLink = AnchorLinkItem & {
    el: HTMLElement | null;
    isInView: boolean;
    active: boolean;
    index: number;
};

export interface AnchorLinksProps {
    links: AnchorLinkItem[];
    /*
     * Optionally pass a function as children to have control over how each link
     * should look. This also allows the usage of stateful components as children
     * that are controlled by the page using the AnchorLinks component.
     */
    children?: (link: ControlledLink) => ReactNode;
    /*
     * onClick handler for when a link item is clicked. Pass this if additional operations
     * are desired on top of scrolling to the target.
     */
    onClick?:
        | ((
              link: ControlledLink,
              event: React.MouseEvent<HTMLLIElement>
          ) => void)
        | ((
              link: ControlledLink,
              event: React.MouseEvent<HTMLLIElement>
          ) => Promise<void>);
}

const AnchorLinks: FC<AnchorLinksProps> = ({ links, children, onClick }) => {
    const [controlledLinks, setControlledLinks] = useState<ControlledLink[]>(
        []
    );

    // separate the props links with a state controlled links
    // able to trigger ui render when link's target is in view
    useEffect(() => {
        const controlled: ControlledLink[] = links.map((link, index) => {
            const el = document.querySelector<HTMLElement>(link.target);
            const isInView = isElementInView(el);

            return {
                ...link,
                el,
                isInView,
                index,
                active: false,
            };
        });

        // filter in view elements
        const visibleLinks: ControlledLink[] = controlled.filter(
            (link) => link.isInView
        );

        // find closest to top
        if (visibleLinks.length) {
            const closest: ControlledLink = visibleLinks.reduce(
                (closest, current) => {
                    const closestDistance = Math.abs(
                        closest.el!.getBoundingClientRect().top
                    );
                    const currentDistance = Math.abs(
                        current.el!.getBoundingClientRect().top
                    );
                    return currentDistance < closestDistance
                        ? current
                        : closest;
                }
            );

            // set the closest index active
            controlled[closest.index].active = true;
        }

        setControlledLinks(controlled);
    }, [links]);

    useEffect(() => {
        const handler = () => {
            setControlledLinks((currentLinks) => {
                // update links in view field
                const newLinks: ControlledLink[] = currentLinks.map((link) => {
                    return {
                        ...link,
                        active: false,
                        isInView: isElementInView(link.el),
                    };
                });
                const visibleLinks: ControlledLink[] = newLinks.filter(
                    (link) => link.isInView
                );

                // find closest to top
                if (visibleLinks.length) {
                    if (isAtEndOfPage()) {
                        // set the last visible section to active if bottom of page has been reached
                        newLinks[
                            visibleLinks[visibleLinks.length - 1].index
                        ].active = true;
                    } else {
                        // get the visible section closest to the top of page
                        const closest: ControlledLink = visibleLinks.reduce(
                            (closest, current) => {
                                const closestDistance = Math.abs(
                                    closest.el!.getBoundingClientRect().top
                                );
                                const currentDistance = Math.abs(
                                    current.el!.getBoundingClientRect().top
                                );
                                return currentDistance < closestDistance
                                    ? current
                                    : closest;
                            }
                        );

                        // set the closest index active
                        newLinks[closest.index].active = true;
                    }
                }

                return newLinks;
            });
        };

        window.addEventListener('scroll', handler);

        return () => {
            window.removeEventListener('scroll', handler);
        };
    }, []);

    return (
        <div>
            <ul className="flex flex-col gap-2">
                {controlledLinks.map((link, idx) => (
                    <li
                        key={link.label}
                        onClick={async (e) =>
                            onClick && (await onClick(link, e))
                        }
                    >
                        <ScrollLink
                            to={link.el ?? link.target}
                            offset={link.offset}
                        >
                            {typeof children === 'function' ? (
                                children(link)
                            ) : (
                                <span
                                    className={clsx(
                                        'flex gap-2 transition hover:text-gray-800 hover:cursor-pointer',
                                        link.active && 'text-black',
                                        !link.active && 'text-gray-400'
                                    )}
                                >
                                    <span>{idx + 1}.</span>
                                    <span>{link.label}</span>
                                </span>
                            )}
                        </ScrollLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export { AnchorLinks };
