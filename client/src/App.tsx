import { useState } from "react";
import "./App.css";

interface fetchData {
  nickname: string;
  password: string;
  verificationCode: string;
}

interface errorData {
  status: number;
  message: string;
  restart: boolean;
}

const App = () => {
  const [accountsArray, setAccountsArray] = useState<fetchData[]>([]);
  const [status, setStatus] = useState("");
  const [responseError, setResponseError] = useState<errorData | null>(null);
  const [content, setContent] = useState<fetchData>();
  const [isButtonActive, setIsButtonActive] = useState<boolean>(true);

  const addAccountToAccountsArray = (account: fetchData) => {
    setAccountsArray([...accountsArray, account]);
  };

  const createAccount = async (): Promise<void> => {
    setIsButtonActive(false);
    setResponseError(null);
    setStatus("Creating account");

    await fetch("/create")
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          addAccountToAccountsArray(response.data);
          setContent(response.data);
          setStatus("Account created");
        } else {
          setResponseError(response.data);
          setStatus("Failed");
        }
      });

    setIsButtonActive(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button
            className="button"
            onClick={createAccount}
            disabled={!isButtonActive}
          >
            Create account
          </button>
        </div>
        <div>{responseError?.message ? responseError.message : ""}</div>
        <div>{status}</div>
        <br />
        <div>
          <div>Nickname: {content?.nickname}</div>
          <div>Passowrd: {content?.password}</div>
          <div>Verification code: {content?.verificationCode}</div>
        </div>
        <br />
        <br />
        <div>
          {accountsArray.map((data, index) => (
            <div key={index}>
              {data.nickname} {data.password} {data.verificationCode}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default App;
