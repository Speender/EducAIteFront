import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Props {
    selections: string[],
    currentSelection: string,
    onSelectChange: (value: string) => void
}

const DropdownSemester = ({ selections, currentSelection, onSelectChange }: Props) => {
    const selectedValue = selections.includes(currentSelection) ? currentSelection : undefined;

    return (
        <Select value={selectedValue} onValueChange={onSelectChange} disabled={selections.length === 0}>
            <SelectTrigger className="h-12 w-full rounded-xl border-white/20 bg-[#111111] px-5 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-white/5 focus-visible:border-[#00CEC8] focus-visible:ring-[#00CEC8]/15 aria-expanded:border-[#00CEC8] md:w-72">
                <SelectValue placeholder={currentSelection} />
            </SelectTrigger>
            <SelectContent
                position="popper"
                align="start"
                className="z-50 rounded-xl border-white/10 bg-[#111111] text-white shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            >
                <SelectGroup>
                    {selections.map((item) => (
                        <SelectItem
                            key={item}
                            value={item}
                            className="py-3 text-sm text-white/80 focus:bg-white/10 focus:text-white data-[state=checked]:bg-[#00CEC8]/10 data-[state=checked]:text-[#00CEC8]"
                        >
                            {item}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default DropdownSemester;
