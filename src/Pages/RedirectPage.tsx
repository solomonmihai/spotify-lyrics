import AuthStore from "../Stores/AuthStore";
import { Redirect } from "react-router-dom";

function getHashParams() {
  var hashParams: any = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export default function RedirectPage() {
  const params = getHashParams();
  const accessToken: string = params.access_token;

  // spotify access tokens expire after 1 hour
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);

  AuthStore.update((state) => {
    state.token = accessToken;
  });

  localStorage.setItem(
    "auth",
    JSON.stringify({
      token: accessToken,
      expires: expiryDate,
    })
  );

  return (
    <Redirect
      to={{
        pathname: "/dashboard",
      }}
    />
  );
}
