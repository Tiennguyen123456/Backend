import { useState } from "react";

export function useRowSelection() {
    const [rowSelection, setRowSelection] = useState({});

    return {
        rowSelection,
        onRowSelection: setRowSelection,
    };
}
