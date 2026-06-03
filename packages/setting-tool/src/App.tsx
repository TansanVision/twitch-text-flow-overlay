import { MainFrame } from './components/MainFrame';
import { Switcher } from './components/Switcher';
import { NewForm } from './components/NewForm';
import { MigrateForm } from './components/MigrateForm';
import { useState } from 'react';

function App() {
    const [mode, setMode] = useState<'new' | 'migrate'>('new');

    return (
        <MainFrame>
            <Switcher onClick={(id) => setMode(id)} />
            {mode === 'new' && <NewForm />}
            {mode === 'migrate' && <MigrateForm />}
        </MainFrame>
    );
}

export { App };