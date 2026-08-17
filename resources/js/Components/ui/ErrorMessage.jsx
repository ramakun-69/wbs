export default function ErrorMessage({ message, className = '', ...props }) {
    return message ? (
        <small 
            {...props}
            className={`text-danger  ${className}`}
        >
            {message}
        </small>
    ) : null;
}
