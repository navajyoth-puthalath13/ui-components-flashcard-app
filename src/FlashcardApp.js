import React, { useState, useEffect, useCallback } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Menu,
    MoreVertical,
    Grid3X3,
    Home,
    ChevronDown,
    Settings,
    LayoutGrid,
    MousePointerClick,
    BarChart2,
    Puzzle,
    MessageSquareText,
    Accessibility
} from 'lucide-react';

const FlashcardApp = () => {
    const [currentCategory, setCurrentCategory] = useState('ui-components');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [swipeStartX, setSwipeStartX] = useState(null);
    const [swipeEndX, setSwipeEndX] = useState(null);
    const [cardState, setCardState] = useState('idle');
    const [pendingDirection, setPendingDirection] = useState(null);
    const [achievement, setAchievement] = useState(null);

    // All flashcard categories
    const categories = {
        'ui-components': {
            name: 'Core UI',
            icon: <LayoutGrid size={20} />,
            description: 'Common interface patterns and their food-inspired names',
            cards: [
                {
                    front: "Hamburger Menu",
                    back: "Three horizontal lines stacked on top of each other. Called 'hamburger' because it resembles a hamburger bun-patty-bun structure when viewed sideways. Used to hide navigation menu items in mobile interfaces.",
                    icon: <Menu size={48} className="text-gray-700 mb-4" />
                },
                {
                    front: "Kebab Menu",
                    back: "Three vertical dots arranged in a column. Named 'kebab' because the three vertical dots resemble pieces of meat skewered on a kebab stick when viewed from the side. Used for contextual actions or overflow menus.",
                    icon: <MoreVertical size={48} className="text-gray-700 mb-4" />
                },
                {
                    front: "Waffle Menu",
                    back: "Nine squares arranged in a 3x3 grid pattern. Called 'waffle' because the grid pattern resembles the square indentations on a waffle's surface. Used by Google and Microsoft for app launchers.",
                    icon: <Grid3X3 size={48} className="text-gray-700 mb-4" />
                },
                {
                    front: "Breadcrumb Navigation",
                    back: "A horizontal navigation trail showing page hierarchy. Named after the fairy tale 'Hansel and Gretel' where children dropped breadcrumbs to find their way back home. Shows users their current location in a website's structure.",
                    icon: (
                        <div className="flex items-center text-gray-700 text-lg mb-4">
                            <Home size={20} />
                            <ChevronRight size={16} className="mx-1" />
                            <span className="text-sm">Category</span>
                            <ChevronRight size={16} className="mx-1" />
                            <span className="text-sm">Product</span>
                        </div>
                    )
                },
                {
                    front: "Döner Menu",
                    back: "Three horizontal lines of decreasing length. Named after döner kebab because the stacked lines of different lengths resemble the layered, cone-shaped döner meat on a spit. A variation of the hamburger menu.",
                    icon: (
                        <div className="flex flex-col items-center space-y-1 mb-4">
                            <div className="w-12 h-1 bg-gray-700 rounded"></div>
                            <div className="w-8 h-1 bg-gray-700 rounded"></div>
                            <div className="w-6 h-1 bg-gray-700 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Meatball Menu",
                    back: "Three horizontal dots in a row. Called 'meatball' because the three circular dots arranged horizontally look like meatballs lined up on a plate. Alternative to kebab menu for horizontal layouts.",
                    icon: (
                        <div className="flex space-x-1 mb-4">
                            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                        </div>
                    )
                },
                {
                    front: "Card Component",
                    back: "A container that groups related information and actions. Called 'card' because it resembles a physical playing card or index card. Popularized by Material Design and now widely used across web interfaces.",
                    icon: (
                        <div className="border-2 border-gray-700 rounded-lg p-4 mb-4 w-16 h-12 flex items-center justify-center">
                            <div className="w-8 h-1 bg-gray-700 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Accordion",
                    back: "A vertically stacked list of collapsible sections. Named after the musical instrument because it expands and contracts like an accordion's bellows. Allows users to show/hide content sections.",
                    icon: (
                        <div className="flex flex-col space-y-1 mb-4">
                            <div className="w-12 h-2 bg-gray-700 rounded"></div>
                            <div className="w-12 h-2 bg-gray-300 rounded"></div>
                            <div className="w-12 h-2 bg-gray-300 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Toast Notification",
                    back: "A brief message that appears temporarily, usually at the top or bottom of the screen. Called 'toast' because it pops up like bread from a toaster. Used for non-intrusive feedback messages.",
                    icon: (
                        <div className="bg-gray-700 text-white text-xs px-3 py-1 rounded mb-4">
                            Success!
                        </div>
                    )
                },
                {
                    front: "Floating Action Button",
                    back: "A circular button that floats above the UI, typically in the bottom-right corner. Called 'floating' because it appears to hover above other content. Promotes the primary action on a screen.",
                    icon: (
                        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    )
                }
            ]
        },
        'buttons': {
            name: 'Actions',
            icon: <MousePointerClick size={20} />,
            description: 'Interactive elements and call-to-action patterns',
            cards: [
                {
                    front: "Primary Button",
                    back: "Main action button with highest visual weight. Called 'primary' because it represents the primary action users should take, like the primary color that stands out most in a color scheme.",
                    icon: (
                        <div className="w-12 h-6 bg-blue-600 text-white text-xs rounded flex items-center justify-center mb-4">
                            Save
                        </div>
                    )
                },
                {
                    front: "Secondary Button",
                    back: "Supporting action with lower visual weight. Called 'secondary' because it represents secondary actions that support the primary action, like secondary characters in a story.",
                    icon: (
                        <div className="w-12 h-6 border border-gray-700 text-gray-700 text-xs rounded flex items-center justify-center mb-4">
                            Cancel
                        </div>
                    )
                },
                {
                    front: "Tertiary Button",
                    back: "Minimal button with subtle styling. Called 'tertiary' because it's the third level of button hierarchy, used for less important actions that don't compete with primary actions.",
                    icon: (
                        <div className="w-12 h-6 text-gray-600 text-xs rounded flex items-center justify-center mb-4 hover:bg-gray-100">
                            Learn More
                        </div>
                    )
                },
                {
                    front: "Ghost Button",
                    back: "Minimal button with only border or text. Called 'ghost' button because it's barely visible like a ghost - it has minimal visual presence but is still interactive.",
                    icon: (
                        <div className="w-12 h-6 text-gray-700 text-xs rounded flex items-center justify-center mb-4 hover:bg-gray-100">
                            Skip
                        </div>
                    )
                },
                {
                    front: "Icon-only Button",
                    back: "Button containing only an icon, no text. Called 'icon button' because it uses an icon to represent its function instead of text, like hieroglyphics communicate through symbols.",
                    icon: (
                        <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center mb-4">
                            <div className="w-3 h-3 bg-white rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Icon + Label Button",
                    back: "Button with both icon and text label. Called 'icon + label' because it combines visual symbolism with clear text communication, making it both intuitive and accessible.",
                    icon: (
                        <div className="w-16 h-6 bg-blue-600 text-white text-xs rounded flex items-center justify-center space-x-1 mb-4">
                            <div className="w-3 h-3 bg-white rounded"></div>
                            <span>Share</span>
                        </div>
                    )
                },
                {
                    front: "Split Button",
                    back: "Button split into main action and dropdown menu. Called 'split button' because it's literally split into two parts - one side performs an action, the other opens options.",
                    icon: (
                        <div className="flex mb-4">
                            <div className="w-8 h-6 bg-blue-600 text-white text-xs rounded-l flex items-center justify-center">
                                Save
                            </div>
                            <div className="w-4 h-6 bg-blue-700 text-white rounded-r flex items-center justify-center">
                                <ChevronDown size={12} />
                            </div>
                        </div>
                    )
                },
                {
                    front: "Dropdown Button",
                    back: "Button that opens a dropdown menu when clicked. Called 'dropdown button' because it drops down a list of options when activated, like a dropdown menu in a restaurant.",
                    icon: (
                        <div className="w-16 h-6 border border-gray-700 rounded flex items-center justify-between px-2 mb-4">
                            <span className="text-xs">Options</span>
                            <ChevronDown size={12} />
                        </div>
                    )
                },
                {
                    front: "Toggle Button",
                    back: "Button that switches between two states. Called 'toggle' because it toggles between on/off states like a light switch, maintaining its state until clicked again.",
                    icon: (
                        <div className="w-12 h-6 bg-green-600 text-white text-xs rounded flex items-center justify-center mb-4">
                            ON
                        </div>
                    )
                },
                {
                    front: "Floating Action Button (FAB)",
                    back: "A circular button that floats above the UI, typically in the bottom-right corner. Called 'floating' because it appears to hover above other content. Promotes the primary action on a screen.",
                    icon: (
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    )
                },
                {
                    front: "Button Group",
                    back: "Multiple buttons grouped together. Called 'button group' because it groups related buttons together, like a group of friends - they work together as a unit.",
                    icon: (
                        <div className="flex mb-4">
                            <div className="w-8 h-6 bg-gray-700 text-white text-xs rounded-l flex items-center justify-center">
                                Left
                            </div>
                            <div className="w-8 h-6 bg-gray-600 text-white text-xs border-l border-r border-gray-500 flex items-center justify-center">
                                Center
                            </div>
                            <div className="w-8 h-6 bg-gray-700 text-white text-xs rounded-r flex items-center justify-center">
                                Right
                            </div>
                        </div>
                    )
                },
                {
                    front: "Loading Button",
                    back: "Button that shows loading state during action. Called 'loading button' because it displays a loading indicator while processing, giving users feedback that their action is being handled.",
                    icon: (
                        <div className="w-16 h-6 bg-blue-600 text-white text-xs rounded flex items-center justify-center space-x-1 mb-4">
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading</span>
                        </div>
                    )
                },
                {
                    front: "Submit Button",
                    back: "Button for submitting forms or data. Called 'submit' because it submits information to be processed, like submitting a form at a government office.",
                    icon: (
                        <div className="w-16 h-6 bg-green-600 text-white text-xs rounded flex items-center justify-center mb-4">
                            Submit
                        </div>
                    )
                },
                {
                    front: "Cancel Button",
                    back: "Button for canceling actions or closing dialogs. Called 'cancel' because it cancels the current operation, like canceling a reservation or appointment.",
                    icon: (
                        <div className="w-16 h-6 border border-gray-700 text-gray-700 text-xs rounded flex items-center justify-center mb-4">
                            Cancel
                        </div>
                    )
                },
                {
                    front: "Reset Button",
                    back: "Button for resetting forms to default values. Called 'reset' because it resets everything back to the original state, like resetting a game to start over.",
                    icon: (
                        <div className="w-16 h-6 border border-gray-700 text-gray-700 text-xs rounded flex items-center justify-center mb-4">
                            Reset
                        </div>
                    )
                },
                {
                    front: "Back Button",
                    back: "Button for returning to previous screen or step. Called 'back' because it takes users back to where they came from, like a back button in a web browser.",
                    icon: (
                        <div className="w-16 h-6 border border-gray-700 text-gray-700 text-xs rounded flex items-center justify-center space-x-1 mb-4">
                            <ChevronLeft size={12} />
                            <span>Back</span>
                        </div>
                    )
                }
            ]
        },
        'display': {
            name: 'Display',
            icon: <BarChart2 size={20} />,
            description: 'Information presentation and data visualization',
            cards: [
                {
                    front: "Card (with media/content)",
                    back: "A container that groups related information and actions. Called 'card' because it resembles a physical playing card or index card. Popularized by Material Design and now widely used across web interfaces.",
                    icon: (
                        <div className="border-2 border-gray-700 rounded-lg p-4 mb-4 w-16 h-12 flex items-center justify-center">
                            <div className="w-8 h-1 bg-gray-700 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Tile",
                    back: "A square or rectangular component for displaying content. Called 'tile' because it resembles floor tiles or wall tiles that are arranged in a grid pattern to cover a surface.",
                    icon: (
                        <div className="w-12 h-12 bg-gray-700 rounded mb-4 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded"></div>
                        </div>
                    )
                },
                {
                    front: "List (bulleted, numbered, definition)",
                    back: "Structured content using visual hierarchy. Called 'list' because it lists items in order, like a shopping list or to-do list that organizes information vertically.",
                    icon: (
                        <div className="flex flex-col space-y-1 mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                <div className="w-8 h-1 bg-gray-700 rounded"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                <div className="w-6 h-1 bg-gray-700 rounded"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                <div className="w-10 h-1 bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Table / Data grid",
                    back: "Structured data in rows and columns. Called 'table' because it presents information in a tabular format, like a dining table with organized place settings in rows and columns.",
                    icon: (
                        <div className="w-16 h-8 border border-gray-700 rounded mb-4">
                            <div className="flex border-b border-gray-700 h-2">
                                <div className="w-1/3 border-r border-gray-700 bg-gray-700"></div>
                                <div className="w-1/3 border-r border-gray-700 bg-gray-700"></div>
                                <div className="w-1/3 bg-gray-700"></div>
                            </div>
                            <div className="flex h-2">
                                <div className="w-1/3 border-r border-gray-700"></div>
                                <div className="w-1/3 border-r border-gray-700"></div>
                                <div className="w-1/3"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Carousel / Slider",
                    back: "Horizontally scrollable content. Called 'carousel' because it rotates through content like a merry-go-round carousel where horses move in a circular pattern.",
                    icon: (
                        <div className="flex space-x-1 mb-4">
                            <div className="w-4 h-6 bg-gray-700 rounded"></div>
                            <div className="w-4 h-6 bg-gray-400 rounded"></div>
                            <div className="w-4 h-6 bg-gray-300 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Gallery / Masonry grid",
                    back: "Collection of images in a grid layout. Called 'gallery' because it displays images like an art gallery where artwork is arranged for viewing and browsing.",
                    icon: (
                        <div className="grid grid-cols-2 gap-1 w-8 h-8 mb-4">
                            <div className="w-3 h-3 bg-gray-700 rounded"></div>
                            <div className="w-3 h-3 bg-gray-400 rounded"></div>
                            <div className="w-3 h-3 bg-gray-500 rounded"></div>
                            <div className="w-3 h-3 bg-gray-600 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Avatar",
                    back: "User profile images, often circular. Called 'avatar' from the Sanskrit word meaning 'incarnation' - it represents a person's digital incarnation or identity in the interface.",
                    icon: (
                        <div className="w-8 h-8 bg-gray-700 rounded-full mb-4 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    )
                },
                {
                    front: "Badge / Status Indicator",
                    back: "Small indicators showing count or status. Called 'badge' because it's like a small badge or pin that displays important information, similar to a name badge or achievement badge.",
                    icon: (
                        <div className="relative mb-4">
                            <div className="w-8 h-8 bg-gray-700 rounded"></div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">3</span>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Tag / Chip / Pill",
                    back: "Labels for categorization, often removable. Called 'tag' because it tags content with labels, like price tags on items or luggage tags that identify and categorize things.",
                    icon: (
                        <div className="flex space-x-1 mb-4">
                            <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded">Tag 1</div>
                            <div className="bg-gray-400 text-white text-xs px-2 py-1 rounded">Tag 2</div>
                        </div>
                    )
                },
                {
                    front: "Progress bar (linear/circular)",
                    back: "Visual indicator showing completion status. Called 'progress bar' because it shows the progress of a task as a bar that fills up, similar to a thermometer showing temperature progress.",
                    icon: (
                        <div className="w-16 h-2 bg-gray-300 rounded mb-4">
                            <div className="w-10 h-2 bg-gray-700 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Spinner / Loader",
                    back: "Animated indicator for loading states. Called 'spinner' because it spins in a circular motion like a spinning top, indicating that something is happening in the background.",
                    icon: (
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-700 rounded-full mb-4 animate-spin"></div>
                    )
                },
                {
                    front: "Skeleton loader",
                    back: "Placeholder content that mimics the actual layout. Called 'skeleton' because it shows the bare bones structure of content while loading, like a skeleton shows the basic structure of a body.",
                    icon: (
                        <div className="w-16 h-8 mb-4">
                            <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
                            <div className="w-3/4 h-2 bg-gray-300 rounded mb-1"></div>
                            <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Timeline / Feed",
                    back: "Chronological display of events or content. Called 'timeline' because it shows events arranged along a line representing time, like a historical timeline showing events in chronological order.",
                    icon: (
                        <div className="w-12 h-8 mb-4">
                            <div className="flex items-center space-x-1 mb-1">
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                                <div className="w-6 h-1 bg-gray-700 rounded"></div>
                            </div>
                            <div className="flex items-center space-x-1 ml-3">
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                <div className="w-4 h-1 bg-gray-500 rounded"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Media object (image + text combo)",
                    back: "Component combining media with descriptive text. Called 'media object' because it's an object that contains both media (image/video) and text content, like a news article with an image and headline.",
                    icon: (
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gray-700 rounded"></div>
                            <div className="flex flex-col space-y-1">
                                <div className="w-8 h-1 bg-gray-700 rounded"></div>
                                <div className="w-6 h-1 bg-gray-500 rounded"></div>
                            </div>
                        </div>
                    )
                }
            ]
        },
        'specialty': {
            name: 'Advanced',
            icon: <Puzzle size={20} />,
            description: 'Advanced interactive features and specialized functionality',
            cards: [
                {
                    front: "Rich Text / Markdown editor",
                    back: "Advanced text input with formatting options. Called 'rich text' because it supports rich formatting (bold, italic, colors) unlike plain text, making the text 'richer' in appearance.",
                    icon: (
                        <div className="w-12 h-8 border border-gray-700 rounded mb-4">
                            <div className="flex p-1 border-b border-gray-300">
                                <div className="text-xs font-bold mr-1">B</div>
                                <div className="text-xs italic mr-1">I</div>
                                <div className="text-xs underline">U</div>
                            </div>
                            <div className="p-1">
                                <div className="w-8 h-1 bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Color picker",
                    back: "Interface for selecting colors. Called 'color picker' because users pick colors from a palette or spectrum, like an artist picking colors from a paint palette.",
                    icon: (
                        <div className="w-8 h-8 rounded mb-4 flex">
                            <div className="w-2 h-8 bg-red-500 rounded-l"></div>
                            <div className="w-2 h-8 bg-green-500"></div>
                            <div className="w-2 h-8 bg-blue-500"></div>
                            <div className="w-2 h-8 bg-yellow-500 rounded-r"></div>
                        </div>
                    )
                },
                {
                    front: "Drag & drop interface",
                    back: "Area where users can drag elements or files. Called 'drag and drop' because users drag items from one location and drop them in another, like physically moving objects.",
                    icon: (
                        <div className="w-12 h-8 border-2 border-dashed border-gray-700 rounded mb-4 flex items-center justify-center">
                            <div className="text-xs">Drop</div>
                        </div>
                    )
                },
                {
                    front: "Infinite scroll",
                    back: "Automatically loads more content as user scrolls. Called 'infinite scroll' because content appears to be infinitely long, continuously loading like an infinite loop.",
                    icon: (
                        <div className="w-8 h-10 mb-4 overflow-hidden">
                            <div className="w-full h-2 bg-gray-700 rounded mb-1"></div>
                            <div className="w-full h-2 bg-gray-600 rounded mb-1"></div>
                            <div className="w-full h-2 bg-gray-500 rounded mb-1"></div>
                            <div className="w-full h-2 bg-gray-400 rounded mb-1"></div>
                            <div className="w-full h-1 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                    )
                },
                {
                    front: "Virtualized list",
                    back: "Renders only visible items for performance. Called 'virtualized' because it creates a virtual representation of the full list, only rendering what's visible like a window showing part of a large painting.",
                    icon: (
                        <div className="w-12 h-8 mb-4">
                            <div className="w-full h-1 bg-gray-700 rounded mb-1"></div>
                            <div className="w-full h-1 bg-gray-700 rounded mb-1"></div>
                            <div className="w-full h-1 bg-gray-700 rounded mb-1"></div>
                            <div className="w-full h-1 bg-gray-300 rounded mb-1"></div>
                            <div className="w-full h-1 bg-gray-300 rounded mb-1"></div>
                            <div className="w-full h-1 bg-gray-700 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Wizard / Multi-step form",
                    back: "Guided form with multiple steps. Called 'wizard' because it guides users through a process like a magical wizard guiding someone through a quest, breaking complex tasks into manageable steps.",
                    icon: (
                        <div className="flex items-center space-x-1 mb-4">
                            <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                            <div className="w-4 h-0.5 bg-gray-700"></div>
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <div className="w-4 h-0.5 bg-gray-400"></div>
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        </div>
                    )
                },
                {
                    front: "Command palette",
                    back: "Searchable interface for app commands. Called 'command palette' because it's like an artist's palette that holds all available tools and commands, allowing quick access to functionality.",
                    icon: (
                        <div className="w-16 h-8 border border-gray-700 rounded mb-4 flex items-center px-2">
                            <div className="w-3 h-3 border border-gray-700 rounded mr-2"></div>
                            <div className="text-xs text-gray-500">Search commands...</div>
                        </div>
                    )
                },
                {
                    front: "Live chat widget",
                    back: "Real-time messaging interface. Called 'live chat' because it enables live, real-time communication between users and support, like having a live conversation with someone in person.",
                    icon: (
                        <div className="w-12 h-8 border border-gray-700 rounded mb-4 p-1">
                            <div className="flex items-end space-x-1">
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                            </div>
                            <div className="w-8 h-1 bg-gray-700 rounded mt-1"></div>
                        </div>
                    )
                },
                {
                    front: "Shortcut keys tooltip",
                    back: "Shows keyboard shortcuts on hover. Called 'shortcut keys tooltip' because it provides a tip about keyboard shortcuts, like a helpful tooltip that shows users faster ways to perform actions.",
                    icon: (
                        <div className="relative mb-4">
                            <div className="w-6 h-6 bg-gray-700 rounded"></div>
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                ⌘K
                            </div>
                        </div>
                    )
                },
                {
                    front: "Voice search input",
                    back: "Search using voice commands. Called 'voice search' because users can search by speaking instead of typing, like having a conversation with the interface to find what they need.",
                    icon: (
                        <div className="w-16 h-6 border border-gray-700 rounded mb-4 flex items-center justify-between px-2">
                            <div className="text-xs">Search...</div>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                    )
                },
                {
                    front: "AI suggestion banner",
                    back: "Smart recommendations from AI. Called 'AI suggestion banner' because it displays intelligent suggestions from artificial intelligence, like having a smart assistant that anticipates your needs.",
                    icon: (
                        <div className="w-16 h-4 bg-blue-100 border border-blue-300 text-blue-800 text-xs rounded flex items-center justify-center mb-4">
                            💡 AI Tip
                        </div>
                    )
                },
                {
                    front: "QR code generator/scanner",
                    back: "Creates or reads QR codes. Called 'QR code' from 'Quick Response' because it provides quick access to information when scanned, like a digital barcode that instantly connects to content.",
                    icon: (
                        <div className="w-8 h-8 border border-gray-700 rounded mb-4 p-1">
                            <div className="grid grid-cols-3 gap-0.5">
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-300"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                            </div>
                        </div>
                    )
                }
            ]
        },
        'social': {
            name: 'Social',
            icon: <MessageSquareText size={20} />,
            description: 'Social features and interactive communication elements',
            cards: [
                {
                    front: "Comment thread",
                    back: "Area for users to add replies and discussions. Called 'comment thread' because comments are threaded together like thread in sewing - each reply connects to form a continuous conversation.",
                    icon: (
                        <div className="w-12 h-8 mb-4">
                            <div className="flex items-center space-x-1 mb-1">
                                <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                                <div className="w-6 h-1 bg-gray-700 rounded"></div>
                            </div>
                            <div className="flex items-center space-x-1 ml-3">
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                <div className="w-4 h-1 bg-gray-500 rounded"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Reply UI",
                    back: "Interface for responding to specific comments. Called 'reply UI' because it provides a user interface specifically designed for replying to other users' comments, creating conversation threads.",
                    icon: (
                        <div className="w-12 h-6 border border-gray-700 rounded mb-4 flex items-center px-2">
                            <div className="text-xs text-gray-500">Reply...</div>
                        </div>
                    )
                },
                {
                    front: "Like / Reaction buttons",
                    back: "Buttons for expressing emotions or approval. Called 'reaction buttons' because they allow users to react to content with different emotions, like reacting to a friend's news with joy, sadness, or surprise.",
                    icon: (
                        <div className="flex space-x-1 mb-4">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">❤️</div>
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">👍</div>
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">😊</div>
                        </div>
                    )
                },
                {
                    front: "Rating (stars/thumbs)",
                    back: "Interface for rating or scoring items. Called 'rating system' because it allows users to rate things, like rating a movie with stars or a restaurant with scores.",
                    icon: (
                        <div className="flex space-x-1 mb-4">
                            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                            <div className="w-3 h-3 bg-gray-300 rounded"></div>
                            <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "Share buttons",
                    back: "Buttons for sharing content to social platforms. Called 'share buttons' because they enable sharing content on social networks, facilitating social interaction and content distribution.",
                    icon: (
                        <div className="flex space-x-1 mb-4">
                            <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">f</div>
                            <div className="w-4 h-4 bg-blue-400 rounded text-white text-xs flex items-center justify-center">t</div>
                            <div className="w-4 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">+</div>
                        </div>
                    )
                },
                {
                    front: "Poll / Voting UI",
                    back: "Interface for creating and participating in polls. Called 'poll' because it allows users to vote on options, like taking a poll to gather opinions from a group of people.",
                    icon: (
                        <div className="w-12 h-8 mb-4">
                            <div className="w-full h-2 bg-gray-300 rounded mb-1">
                                <div className="w-8 h-2 bg-blue-500 rounded"></div>
                            </div>
                            <div className="w-full h-2 bg-gray-300 rounded">
                                <div className="w-4 h-2 bg-green-500 rounded"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Mentions / tagging (@user)",
                    back: "System for referencing other users. Called 'mentions' because it mentions or calls attention to specific users, like mentioning someone's name in a conversation to get their attention.",
                    icon: (
                        <div className="w-16 h-6 border border-gray-700 rounded mb-4 flex items-center px-2">
                            <span className="text-xs text-blue-600">@username</span>
                        </div>
                    )
                }
            ]
        },
        'accessibility': {
            name: 'Accessibility',
            icon: <Accessibility size={20} />,
            description: 'Components for inclusive design and assistive technology',
            cards: [
                {
                    front: "Screen-reader-only text",
                    back: "Text that's hidden visually but available to screen readers. Called 'screen-reader-only' because it's only accessible to screen reading software, providing context that sighted users can see but visually impaired users need to hear.",
                    icon: (
                        <div className="w-12 h-6 border border-gray-700 rounded mb-4 flex items-center justify-center relative">
                            <div className="w-8 h-1 bg-gray-700 rounded"></div>
                            <div className="absolute inset-0 bg-transparent text-xs text-transparent">Hidden text</div>
                        </div>
                    )
                },
                {
                    front: "Focus ring",
                    back: "Visual indicator showing keyboard focus. Called 'focus ring' because it creates a ring or outline around the focused element, like a spotlight ring that shows which element is currently selected.",
                    icon: (
                        <div className="w-8 h-8 border-2 border-blue-500 rounded mb-4 flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-700 rounded"></div>
                        </div>
                    )
                },
                {
                    front: "High-contrast toggle",
                    back: "Switch for high contrast color schemes. Called 'high-contrast toggle' because it toggles between normal and high-contrast color modes, making text and elements more visible for users with visual impairments.",
                    icon: (
                        <div className="w-12 h-6 bg-gray-800 rounded mb-4 flex items-center justify-end px-0.5">
                            <div className="w-5 h-5 bg-white rounded-full"></div>
                        </div>
                    )
                },
                {
                    front: "Text size adjuster",
                    back: "Control for changing text size. Called 'text size adjuster' because it allows users to adjust the size of text, like adjusting the volume on a speaker to make content more readable for different visual needs.",
                    icon: (
                        <div className="flex items-center space-x-1 mb-4">
                            <div className="text-xs">A</div>
                            <div className="w-8 h-2 bg-gray-300 rounded flex items-center">
                                <div className="w-4 h-2 bg-gray-700 rounded"></div>
                            </div>
                            <div className="text-lg">A</div>
                        </div>
                    )
                },
                {
                    front: "ARIA-labeled components",
                    back: "Components with accessibility labels. Called 'ARIA-labeled' because they use ARIA (Accessible Rich Internet Applications) attributes to provide labels and descriptions for assistive technology, like adding subtitles to a movie.",
                    icon: (
                        <div className="w-12 h-6 border border-gray-700 rounded mb-4 flex items-center justify-center">
                            <div className="text-xs text-gray-500">Button</div>
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-blue-600">aria-label</div>
                        </div>
                    )
                },
                {
                    front: "Keyboard shortcuts support",
                    back: "Keyboard navigation and shortcuts. Called 'keyboard shortcuts' because they provide faster ways to perform actions using keyboard combinations, like using Ctrl+C to copy instead of right-clicking and selecting copy.",
                    icon: (
                        <div className="flex space-x-1 mb-4">
                            <div className="w-6 h-4 border border-gray-700 rounded text-xs flex items-center justify-center">Ctrl</div>
                            <div className="w-4 h-4 border border-gray-700 rounded text-xs flex items-center justify-center">C</div>
                        </div>
                    )
                },
                {
                    front: "Live announcements for assistive tech",
                    back: "Dynamic content updates for screen readers. Called 'live announcements' because they announce changes to assistive technology in real-time, like a news ticker that announces breaking news as it happens.",
                    icon: (
                        <div className="w-16 h-4 bg-green-100 border border-green-300 text-green-800 text-xs rounded flex items-center justify-center mb-4">
                            Live: Updated
                        </div>
                    )
                }
            ]
        },
        'utility': {
            name: 'Utilities',
            icon: <Settings size={20} />,
            description: 'Helper components and utility features',
            cards: [
                {
                    front: "Status dot / Online indicator",
                    back: "Small indicator showing user status. Called 'status dot' because it's a small dot that indicates status, like a traffic light dot that shows whether someone is available, busy, or offline.",
                    icon: (
                        <div className="relative mb-4">
                            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                    )
                },
                {
                    front: "QR code",
                    back: "Quick response code for instant access. Called 'QR code' from 'Quick Response' because it provides quick access to information when scanned, like a digital barcode that instantly connects to content.",
                    icon: (
                        <div className="w-8 h-8 border border-gray-700 rounded mb-4 p-1">
                            <div className="grid grid-cols-3 gap-0.5">
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-300"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                                <div className="w-1 h-1 bg-gray-700"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Clipboard copy button",
                    back: "Button for copying text to clipboard. Called 'clipboard copy' because it copies content to the system clipboard, like using scissors to cut and paste text in a physical document.",
                    icon: (
                        <div className="w-8 h-6 border border-gray-700 rounded mb-4 flex items-center justify-center">
                            <div className="text-xs">📋</div>
                        </div>
                    )
                },
                {
                    front: "Download button",
                    back: "Button for downloading files. Called 'download' because it downloads (transfers) files from the server to the user's device, like downloading a package from a delivery service.",
                    icon: (
                        <div className="w-8 h-6 bg-blue-600 text-white rounded mb-4 flex items-center justify-center">
                            <div className="text-xs">⬇</div>
                        </div>
                    )
                },
                {
                    front: "Embedded map/video player",
                    back: "Media content embedded in the page. Called 'embedded' because it's embedded (inserted) into the webpage, like embedding a gem into jewelry - the content becomes part of the page.",
                    icon: (
                        <div className="w-12 h-8 border border-gray-700 rounded mb-4 flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded"></div>
                            </div>
                        </div>
                    )
                },
                {
                    front: "Timer / Countdown",
                    back: "Time-based display component. Called 'timer' because it times events or counts down to a specific moment, like a kitchen timer that counts down until your food is ready.",
                    icon: (
                        <div className="w-12 h-6 border border-gray-700 rounded mb-4 flex items-center justify-center">
                            <div className="text-xs font-mono">12:34</div>
                        </div>
                    )
                },
                {
                    front: "Dark mode / Theme toggle",
                    back: "Switch for changing color themes. Called 'theme toggle' because it toggles between different visual themes, like switching between day and night modes on a phone.",
                    icon: (
                        <div className="w-12 h-6 bg-gray-800 rounded mb-4 flex items-center justify-end px-0.5">
                            <div className="w-5 h-5 bg-yellow-400 rounded-full"></div>
                        </div>
                    )
                },
                {
                    front: "Hover preview card",
                    back: "Card that appears on hover. Called 'hover preview' because it provides a preview of content when you hover over an element, like a movie trailer that plays when you hover over a film title.",
                    icon: (
                        <div className="relative mb-4">
                            <div className="w-8 h-8 bg-gray-700 rounded"></div>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-700 rounded shadow-lg p-2 w-16 h-12">
                                <div className="w-full h-1 bg-gray-700 rounded mb-1"></div>
                                <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
                            </div>
                        </div>
                    )
                }
            ]
        },
        // ... existing code for other categories ...
    };

    const currentCards = categories[currentCategory]?.cards || [];
    const currentCard = currentCards[currentIndex];

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    const handleNext = () => {
        if (!animating) {
            setAnimating(true);
            setSlideDirection('next');
            setTimeout(() => {
                setFlipped(false);
                if (currentIndex < currentCards.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                } else {
                    setCurrentIndex(0); // Loop back to first card
                }
                setTimeout(() => {
                    setAnimating(false);
                    setSlideDirection('');
                }, 50);
            }, 400);
        }
    };

    const handlePrevious = () => {
        if (!animating) {
            setAnimating(true);
            setSlideDirection('prev');
            setTimeout(() => {
                setFlipped(false);
                if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                } else {
                    setCurrentIndex(currentCards.length - 1); // Loop to last card
                }
                setTimeout(() => {
                    setAnimating(false);
                    setSlideDirection('');
                }, 50);
            }, 400);
        }
    };

    const handleCategoryChange = (categoryKey) => {
        setCurrentCategory(categoryKey);
        setCurrentIndex(0);
        setFlipped(false);
        setShowCategoryDropdown(false);
    };

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'ArrowLeft') triggerCardChange('prev');
        if (e.key === 'ArrowRight') triggerCardChange('next');
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleFlip();
        }
        if (e.key === 'Escape') {
            setShowCategoryDropdown(false);
        }
    }, [currentIndex, currentCards.length, flipped, cardState]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, currentCards.length, flipped, cardState]);

    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showCategoryDropdown && !e.target.closest('.category-dropdown')) {
                setShowCategoryDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showCategoryDropdown]);

    const handleTouchStart = (e) => {
        if (e.touches && e.touches.length === 1) {
            setSwipeStartX(e.touches[0].clientX);
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches && e.touches.length === 1) {
            setSwipeEndX(e.touches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        if (swipeStartX !== null && swipeEndX !== null) {
            const diff = swipeStartX - swipeEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    triggerCardChange('next'); // Swipe left
                } else {
                    triggerCardChange('prev'); // Swipe right
                }
            }
        }
        setSwipeStartX(null);
        setSwipeEndX(null);
    };

    const categoryKeys = Object.keys(categories);

    const showAchievement = (message) => {
        setAchievement(message);
        setTimeout(() => setAchievement(null), 2000);
    };

    const triggerCardChange = (direction) => {
        if (cardState === 'idle') {
            // If at last card and going next
            if (
                direction === 'next' &&
                currentIndex === currentCards.length - 1
            ) {
                const currentCategoryIdx = categoryKeys.indexOf(currentCategory);
                if (currentCategoryIdx < categoryKeys.length - 1) {
                    const nextCategoryKey = categoryKeys[currentCategoryIdx + 1];
                    showAchievement(`Nice work! You finished "${categories[currentCategory].name}".`);
                    setTimeout(() => {
                        setCurrentCategory(nextCategoryKey);
                        setCurrentIndex(0);
                        setFlipped(false);
                    }, 1200);
                    return;
                } else {
                    showAchievement("You've explored every category. Well done!");
                    return;
                }
            }
            // If at first card and going prev, go to previous category's last card
            if (
                direction === 'prev' &&
                currentIndex === 0
            ) {
                const currentCategoryIdx = categoryKeys.indexOf(currentCategory);
                if (currentCategoryIdx > 0) {
                    const prevCategoryKey = categoryKeys[currentCategoryIdx - 1];
                    setCurrentCategory(prevCategoryKey);
                    setCurrentIndex(categories[prevCategoryKey].cards.length - 1);
                    setFlipped(false);
                    return;
                }
            }
            setCardState('out');
            setPendingDirection(direction);
        }
    };

    useEffect(() => {
        if (cardState === 'out' && pendingDirection) {
            const timeout = setTimeout(() => {
                if (pendingDirection === 'next') {
                    setCurrentIndex((prev) => (prev < currentCards.length - 1 ? prev + 1 : 0));
                } else if (pendingDirection === 'prev') {
                    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : currentCards.length - 1));
                }
                setCardState('in');
            }, 350); // match animation duration
            return () => clearTimeout(timeout);
        } else if (cardState === 'in') {
            const timeout = setTimeout(() => {
                setCardState('idle');
                setPendingDirection(null);
            }, 350);
            return () => clearTimeout(timeout);
        }
    }, [cardState, pendingDirection, currentCards.length]);

    const getCardAnimation = () => {
        if (cardState === 'out' && pendingDirection === 'next') return 'card-bubble-out-left';
        if (cardState === 'out' && pendingDirection === 'prev') return 'card-bubble-out-right';
        if (cardState === 'in' && pendingDirection === 'next') return 'card-bubble-in-right';
        if (cardState === 'in' && pendingDirection === 'prev') return 'card-bubble-in-left';
        return '';
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#6A9BCC' }}>
            {/* Category Selector */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 category-dropdown z-20">
                <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex items-center space-x-2 bg-white/20 text-white px-3 py-2 md:px-4 rounded-full hover:bg-white/30 transition-colors text-sm md:text-base"
                >
                    {categories[currentCategory]?.icon}
                    <span className="font-medium hidden sm:inline">{categories[currentCategory]?.name}</span>
                    <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl py-2 w-64 md:min-w-64 z-10 max-h-96 overflow-y-auto">
                        {Object.entries(categories).map(([key, category]) => (
                            <button
                                key={key}
                                onClick={() => handleCategoryChange(key)}
                                className={`w-full text-left px-3 py-2 md:px-4 md:py-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 md:space-x-3 ${currentCategory === key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                    }`}
                            >
                                <div className={currentCategory === key ? 'text-blue-600' : 'text-gray-500'}>
                                    {category.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm md:text-base truncate">{category.name}</div>
                                    <div className="text-xs md:text-sm text-gray-500 truncate">
                                        {category.cards.length === 1 ? '1 card available' : `${category.cards.length} cards available`}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Flashcard */}
            <div className="w-full max-w-2xl px-4 md:px-8 mt-16 md:mt-0">
                <div className="relative w-full h-96 max-h-[80vh] flex items-center justify-center mx-auto" style={{ perspective: '1000px' }}>
                    {/* Single Card Container */}
                    <div
                        className={`relative w-full h-96 ${cardState === 'idle' ? 'transition-all duration-500 ease-in-out' : ''} transform-style-preserve-3d cursor-pointer ${flipped ? 'rotate-x-180' : ''} ${getCardAnimation()}`}
                        style={{ transformStyle: 'preserve-3d' }}
                        onClick={handleFlip}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Front of card */}
                        <div
                            className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                            <div className="text-center flex-1 flex flex-col items-center justify-center">
                                {currentCard?.icon && <div className="mb-4">{currentCard.icon}</div>}
                                <h2 className="text-4xl font-medium text-gray-800">{currentCard?.front}</h2>
                            </div>
                            <p className="text-gray-500 mt-auto">Use ↑↓ arrows or click to flip</p>
                        </div>

                        {/* Back of card */}
                        <div
                            className="absolute inset-0 bg-white rounded-3xl shadow-xl flex items-center justify-center p-8 rotate-x-180 backface-hidden"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateX(180deg)'
                            }}
                        >
                            <div className="text-center">
                                <p className="text-xl text-gray-700 leading-relaxed">{currentCard?.back}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-center mt-8 space-x-8">
                    <button
                        onClick={() => triggerCardChange('prev')}
                        className="p-3 rounded-full transition-all bg-white/20 text-white hover:bg-white/30"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => triggerCardChange('next')}
                        className="p-3 rounded-full transition-all bg-white/20 text-white hover:bg-white/30"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Category Info */}
                <div className="text-center mt-6">
                    <p className="text-white/80 text-sm">
                        Designed & Developed by{' '}
                        <span
                            className="text-white cursor-pointer hover:text-blue-200 transition-colors underline"
                            onClick={() => {
                                // Create and click links programmatically
                                const linkedinLink = document.createElement('a');
                                linkedinLink.href = 'https://www.linkedin.com/in/navajyothp/';
                                linkedinLink.target = '_blank';
                                linkedinLink.rel = 'noopener noreferrer';
                                document.body.appendChild(linkedinLink);
                                linkedinLink.click();
                                document.body.removeChild(linkedinLink);

                                const instagramLink = document.createElement('a');
                                instagramLink.href = 'https://www.instagram.com/jo.ux__/';
                                instagramLink.target = '_blank';
                                instagramLink.rel = 'noopener noreferrer';
                                document.body.appendChild(instagramLink);
                                instagramLink.click();
                                document.body.removeChild(instagramLink);
                            }}
                        >
                            Jo.UX
                        </span>
                    </p>
                </div>
            </div>

            {/* Achievement Modal/Toast */}
            {achievement && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-xl shadow-lg z-50 text-base font-medium animate-achieve-pop w-auto max-w-xs min-w-[120px] text-center flex items-center justify-center gap-2 border border-green-200"
                    style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.12)' }}>
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="truncate text-sm sm:text-base leading-tight">{achievement}</span>
                </div>
            )}

            {/* Custom CSS for animations */}
            <style jsx>{`
        .rotate-x-180 {
          transform: rotateX(180deg);
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        /* Smooth flip animation */
        .transition-all {
          transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* Bubble-like card slide animations */
        .card-bubble-out-left {
          animation: cardBubbleOutLeft 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
        .card-bubble-out-right {
          animation: cardBubbleOutRight 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
        .card-bubble-in-right {
          animation: cardBubbleInRight 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
        .card-bubble-in-left {
          animation: cardBubbleInLeft 0.5s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
        @keyframes cardBubbleOutLeft {
          0% { transform: scale(1) translateX(0); opacity: 1; }
          100% { transform: scale(0.9) translateX(-80px); opacity: 0; }
        }
        @keyframes cardBubbleOutRight {
          0% { transform: scale(1) translateX(0); opacity: 1; }
          100% { transform: scale(0.9) translateX(80px); opacity: 0; }
        }
        @keyframes cardBubbleInRight {
          0% { transform: scale(0.9) translateX(80px); opacity: 0; }
          100% { transform: scale(1) translateX(0); opacity: 1; }
        }
        @keyframes cardBubbleInLeft {
          0% { transform: scale(0.9) translateX(-80px); opacity: 0; }
          100% { transform: scale(1) translateX(0); opacity: 1; }
        }
        .animate-achieve-pop {
          animation: achievePopIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes achievePopIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.95) translateX(-50%); }
          100% { opacity: 1; transform: translateY(0) scale(1) translateX(-50%); }
        }
      `}</style>
        </div>
    );
};

export default FlashcardApp;