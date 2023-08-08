import { useCallback, useState } from "react";

const useInput = <T>(initialData: T) => {
    const [value, setValue] = useState(initialData);
    const handler = useCallback((e) => {
        setValue(e.target.value);
    }, []);
    return [value, handler, setValue];
};

export default useInput;