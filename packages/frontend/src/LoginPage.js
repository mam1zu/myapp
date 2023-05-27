import { css } from "@emotion/react";
import { useState } from "react";
import { SHA256 } from "crypto-js";

/** @jsxImportSource @emotion/react */

const mainframe_css = css({
    width: "400px",
    height: "600px",
    margin: "20vh auto",
    border: "1px solid black"
});

const welcome_logo = css({
    fontSize: "40px",
    textAlign: "center",
    margin: "150px 0 0",
    "@font-face": {
        fontFamily: "Inter",
        src: 'url(./font/Inter-Regular.ttf) format("truetype")',
    },
    fontFamily: "Inter"
});

const element_logo = css({
    fontSize: "20px",
    textAlign: "left",
    marginLeft: "10px",
    marginRight: "30px",
    "@font-face": {
        fontFamily: "Inter",
        src: 'url(./font/Inter-Regular.ttf) format("truetype")'
    },
    fontFamily: "Inter",
    display: "inline-block",

});

const input_style = css({
    display: "inline-block",
}

);
export const LoginPage = () => {

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loginfailed, setLoginfailed] = useState(false);

    const handleSubmit = async (event) => {

        event.preventDefault();

        const hashedPassword = () => {
            const hash = SHA256(password);
            return hash.toString();
        }
        
        const submit_json = {
            id: id,
            pass_hash: hashedPassword(),
        }



        //バックエンドに送信
        await fetch("/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submit_json),
        })
        .then(res => {
            setLoginfailed(res.status() !== 200);
            if(res.status() == 200) {

            }
        });



        console.log("oke?");

    };

    const failed_message = () => {
        return loginfailed ? <h3>Login failed</h3> : <br/>;  
    }
    
    return(
        <div>
            <div className="mainframe" css={mainframe_css}>
                <h1 css={welcome_logo}>Welcome</h1>
                <form onSubmit={handleSubmit}>
                    <br/>
                    <h3 css={element_logo}>Username</h3>
                    <input type="text" css={input_style} value={username} onChange={(event) => {event.preventDefault(); setId(event.target.value);}}/>
                    <br/>
                    <h3 css={element_logo}>Password</h3>
                    <input type="text" css={input_style} value={password} onChange={(event) => {event.preventDefault(); setPassword(event.target.value);}}/>
                    <br/>
                    <input type="submit" value="Log in"/>
                    {failed_message}
                </form>
            </div>
        </div>
    );
}