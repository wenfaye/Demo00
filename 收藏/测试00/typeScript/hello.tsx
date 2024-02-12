import * as React from 'react';

interface IHelloProps {
    userName:string
}

const Hello: React.FunctionComponent<IHelloProps> = (props) => {
  return <h2>Hello user: {props.userName} !</h2>;
};

export default Hello;
