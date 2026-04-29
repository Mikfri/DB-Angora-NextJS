// src/components/ui/heroui/index.ts

/** Central HeroUI import hub.
 *  All project code should import HeroUI components from here instead of
 *  directly from '@heroui/react'. When HeroUI updates to a new major version,
 *  only the mappings in this file (and the wrapper files in this folder) need
 *  to be reviewed and updated.
 */

export {
    // Layout & structure
    Card,
    Separator,
    // Inputs
    Button,
    Input,
    InputGroup,
    TextArea,
    TextField,
    Label,
    NumberField,
    Switch,
    RadioGroup,
    Radio,
    Checkbox,
    // Display
    Chip,
    Badge,
    Spinner,
    Tooltip,
    Avatar,
    // Navigation
    Tabs,
    Breadcrumbs,
    BreadcrumbsItem,
    Pagination,
    Slider,
    // Overlay
    Modal,
    AlertDialog,
    Dropdown,
    DropdownTrigger,
    DropdownPopover,
    DropdownMenu,
    DropdownItem,
    Popover,
    // Collection
    Autocomplete,
    SearchField,
    ListBox,
    ListBoxItem,
    ListBoxSection,
    Select,
    Table,
    // Feedback
    Alert,
    // Misc
    Link,
    Header,
    // Hooks
    useFilter,
} from '@heroui/react';

// Wrapped components (simplified APIs over HeroUI compound components)
export { HeroSelect, HeroSelectItem } from './HeroSelect';
