import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectToHash({ to }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);

  return null;
}
