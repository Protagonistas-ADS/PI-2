import type { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { CampoInput } from "./style";

interface InputGeralProps {
    type: HTMLInputTypeAttribute;
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    minLength?: number;
    autoComplete?: string;
}

function InputGeral({
    type,
    label,
    placeholder,
    value,
    onChange,
    required = false,
    minLength,
    autoComplete
}: InputGeralProps) {
    return (
        <div>
            {label && <label>{label}</label>}

            <CampoInput
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                autoComplete={autoComplete}
            />
        </div>
    );
}

export default InputGeral;