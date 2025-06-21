export default function Alert(props) {
  let classNames;
  switch (props.type) {
    case "error":
      classNames = "border-l-red-400 bg-red-500/10 text-red-200";
      break;
    case "success":
      classNames = "border-l-green-500 bg-green-500/10 text-green-200";
      break;
    case "warning":
      classNames = "border-l-amber-400 bg-amber-500/10 text-amber-200";
      break;
    case "info":
      classNames = "border-l-blue-400 bg-blue-500/10 text-blue-200";
      break;
    default:
      classNames = "border-l-amber-400 bg-amber-500/10 text-amber-200";
  }
  return (
    <div className={`${classNames} border-l-4 my-3 pl-4 pr-3 py-3 rounded-l-sm rounded-r-lg backdrop-blur-sm`}>
      {props.children}
    </div>
  );
}
