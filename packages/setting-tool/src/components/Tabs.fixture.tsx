import { Tabs } from "./Tabs";
import { useState } from "react";

export default () => {
    const [activeTab, setActiveTab] = useState("tab1");

    return (
        <Tabs
            tabs={[
                { id: "tab1", label: "Tab 1" },
                { id: "tab2", label: "Tab 2" },
                { id: "tab3", label: "Tab 3" },
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id)}
        />
    );
}