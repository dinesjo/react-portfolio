export default function Alert(props) {
  let borderClassName;
  switch (props.type) {
    case "error":
      borderClassName = "border-l-red-400";
      break;
    case "success":
      borderClassName = "border-l-green-500";
      break;
    case "warning":
      borderClassName = "border-l-amber-400";
      break;
    case "info":
      borderClassName = "border-l-blue-400";
      break;
    default:
      borderClassName = "border-l-amber-400";
  }
  return (
    <div className={`${borderClassName} border-l-4 my-2 pl-4`}>
      {props.children}
    </div>
  );
}
