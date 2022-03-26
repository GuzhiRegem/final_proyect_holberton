import React, {useState } from "react";
import { Form, Button, Tabs, Tab, FloatingLabel, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { Apiurl } from "../services/apirest";
import { useNavigate } from "react-router-dom";

export function Login () {

  const Navigate = useNavigate();
 
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handelchange = ({ target:{name, value} }) => {
    setUser({ ...user, [name]: value });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    console.log(user);
  };

  const handelLogin = () => {
    let url = Apiurl + "/api/get_tokens"
    axios.post(url, user)
    .then(res => {
      console.log(res)
      if (res.status === 200) {
      localStorage.setItem("write_token", res.data.write_token);
      localStorage.setItem("read_token", res.data.read_token);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("username", user.username);
      Navigate("/user/" + user.username);
      }})
    .catch(err => {
      if (err.response) {
        setError(true);
        setErrorMessage(err.response.data);
      }})
  };
      
    return (
      <>
      <React.Fragment>
        <Tabs defaultActiveKey="login" id="uncontrolled-tab-example" className="tabs-form">
          <Tab eventKey="login" title="Log in"  className="login-form">
            <div>
            <Form onSubmit={handelSubmit} >
              <Form.Group className="mb-3" controlId="formBasicEmail">
              <FloatingLabel label="User">
                <input 
                className="form-control input-sm" 
                type="text" 
                name="username" 
                placeholder="User"
                onChange={handelchange}
                />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
              <FloatingLabel label="Password">
                <input 
                className="form-control input-sm" 
                type="password"
                name="password"
                placeholder="Password"
                onChange={handelchange}
                />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button 
              className="Button" 
              type="submit"
              onClick={handelLogin}
              >
              Submit
              </Button>
              {error === true ? <Alert variant="danger">{errorMessage}</Alert> : null}
            </Form>
          </div>
          </Tab>
          
          <Tab eventKey="signup" title="Sign up">
          <div className='login-form'>
            <Form>
              <Row className="mb-3">
                <Form.Group className="mb-3" as={Col} controlId="formBasicEmail">
                  <FloatingLabel label="Name">
                  <input className="form-control input-sm" type="text" name="Name" placeholder="name" />
                  </FloatingLabel>
                </Form.Group>

                <Form.Group className="mb-3" as={Col} controlId="formBasicName">
                  <FloatingLabel label="User">   
                  <input className="form-control input-sm" type="text" name="email" placeholder="User" />
                  </FloatingLabel>
                </Form.Group>
              </Row>
      
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel label="Email">
                <input className="form-control input-sm" type="email" name="email" placeholder="Email" />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <FloatingLabel label="Password">
                <input className="form-control input-sm" type="password" name="password" placeholder="Password" />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button 
              className="Button" 
              type="submit"
              >
                Submit
              </Button>
            </Form>
          </div>
          </Tab>
        </Tabs>
      </React.Fragment>
      </>
    );
  }
