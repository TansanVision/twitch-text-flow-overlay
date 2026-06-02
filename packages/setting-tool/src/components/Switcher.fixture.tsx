import React from 'react';
import { Switcher } from './Switcher';

export default () => {
    const [active, setActive] = React.useState(true);

    return <div>
            <Switcher onClick={() => setActive(!active)} />
                {active ? <p>新規が選択されています</p> : <p>移行が選択されています</p>}
        </div>
}