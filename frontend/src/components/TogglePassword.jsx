import { FaEye, FaEyeSlash } from "react-icons/fa";

const TogglePassword = ({ isPasswordVisible,toggleVisibility, className }) => {
  const Icon = isPasswordVisible ? FaEyeSlash : FaEye;
  return <Icon onClick={toggleVisibility} className={className} />;
};

export default TogglePassword;
