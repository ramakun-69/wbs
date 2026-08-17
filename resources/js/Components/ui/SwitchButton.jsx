import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ErrorMessage from './ErrorMessage';

export default forwardRef(function SwitchButton(
    { type = 'text', className = '', isFocused = false, errorMessage, label, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [localError, setLocalError] = useState(errorMessage);

    // Generate unique ID for input/label
    const inputId = useRef(`switch-${Math.random().toString(36).substr(2, 9)}`);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    useEffect(() => {
        setLocalError(errorMessage);
    }, [errorMessage]);

    const handleChange = (e) => {
        setLocalError('');
        props.onChange?.(e);
    };

    return (
        <>
            <div className='form-switch switch-primary'>
                <input
                    {...props}
                    id={inputId.current}
                    type="checkbox"
                    className={`form-check-input ${className} ${localError ? 'is-invalid' : ''}`}
                    role="switch"
                    ref={localRef}
                    onChange={handleChange}
                />

                {label && (
                    <label htmlFor={inputId.current} className="ms-2">
                        {label}
                    </label>
                )}
            </div>

            <ErrorMessage message={localError} className="mt-2 text-danger" />
        </>
    );
});
