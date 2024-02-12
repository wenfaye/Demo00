import *  as React from 'react';

interface INameEditProps {
    userName:string;
    onChange:(e)=>void
}

const NameEdit: React.FunctionComponent<INameEditProps> = (props) => {
    const {userName,onChange} = props;
  return 
  <>
      <label>Update name:</label>
    <input value={userName} onChange={onChange} />
  </>
  ;
};

export default NameEdit;
