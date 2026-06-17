import { ToggleButton } from "./ToggleButton";
import { useState } from "react";

export default () => {
    const [checked, setChecked] = useState(false);

    return (
        <ToggleButton
            checked={checked}
            onChange={(newChecked) => setChecked(newChecked)}
        />
    );
}