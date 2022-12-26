export interface DropdownSelectProps {
    hovering?: boolean;
    options: string[];
    onChange: (title: string) => void;
}