import React, { Component } from 'react';
import './demo.css'
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from './utils';

const form1 = [
  {
    id: 0,
    element: <h2>Form Header</h2>
  }, {
    id: 1,
    label: 'Full Name',
    element: <div className="field-group"><input type="text" /><input type="text" /></div>
  }, {
    id: 2,
    label: 'Email',
    element: <input type="email" />
  }, {
    id: 3,
    label: 'Address',
    element: <textarea name="address" id="" cols="30" rows="10" />
  },
  {
    id: 5,
    label: 'Radio',
    element: (
      <div>
        <div><label><input type="radio" name="r" /> option 1</label></div>
        <div><label><input type="radio" name="r" /> option 2</label></div>
        <div><label><input type="radio" name="r" /> option 3</label></div>
        <div><label><input type="radio" name="r" /> option 4</label></div>
        <div><label><input type="radio" name="r" /> option 5</label></div>
      </div>
    )
  }, {
    id: 4,
    label: 'Options',
    element: (<select>
      <option value="1">Option 1</option>
      <option value="2" selected>Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
    </select>)
  }
  , {
    id: 6,
    label: 'Checkbox',
    element: (
      <div>
        <div><label><input type="checkbox" name="r" /> option 1</label></div>
        <div><label><input type="checkbox" name="r" /> option 2</label></div>
        <div><label><input type="checkbox" name="r" /> option 3</label></div>
        <div><label><input type="checkbox" name="r" /> option 4</label></div>
        <div><label><input type="checkbox" name="r" /> option 5</label></div>
      </div>
    )
  }, {
    id: 7,
    element: (
      <div>
        <button className="form-submit-button">Submit</button>
      </div>
    )
  }
];

const form2 = [
  {
    id: 0,
    element: <h2>Form Header</h2>
  }, {
    id: 1,
    label: 'Full Name',
    element: <div className="field-group"><input type="text" /><input type="text" /></div>
  }, {
    id: 2,
    label: 'Email',
    element: <input type="email" />
  }, {
    id: 3,
    label: 'Address',
    element: <textarea name="address" id="" cols="30" rows="10" />
  },
  {
    id: 5,
    label: 'Radio',
    element: (
      <div>
        <div><label><input type="radio" name="r" /> option 1</label></div>
        <div><label><input type="radio" name="r" /> option 2</label></div>
        <div><label><input type="radio" name="r" /> option 3</label></div>
        <div><label><input type="radio" name="r" /> option 4</label></div>
        <div><label><input type="radio" name="r" /> option 5</label></div>
      </div>
    )
  }, {
    id: 4,
    label: 'Options',
    element: (<select>
      <option value="1">Option 1</option>
      <option value="2" selected>Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
    </select>)
  }
  , {
    id: 6,
    label: 'Checkbox',
    element: (
      <div>
        <div><label><input type="checkbox" name="r" /> option 1</label></div>
        <div><label><input type="checkbox" name="r" /> option 2</label></div>
        <div><label><input type="checkbox" name="r" /> option 3</label></div>
        <div><label><input type="checkbox" name="r" /> option 4</label></div>
        <div><label><input type="checkbox" name="r" /> option 5</label></div>
      </div>
    )
  }, {
    id: 7,
    element: (
      <div>
        <button className="form-submit-button">Submit</button>
      </div>
    )
  }
];

class Form extends Component {
  constructor() {
    super();
    this.generateForm = this.generateForm.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.state = {
      form1,
      form2
    };
  }

  render() {
    return (
      <div className='form-wrap'>
        <div className="form-demo">
          <div className="form">
            <Container
            groupName="1"
            getChildPayload={i => this.state.form1[i]}
              style={{ paddingBottom: '200px' }}
              dragClass="form-ghost"
              dropClass="form-ghost-drop"
              onDrop={(dropResult)=>{this.onDrop('form1',dropResult)}}
              nonDragAreaSelector=".field">
              {this.generateForm(this.state.form1)}
            </Container>
          </div>
        </div>
        <div className="form-demo">
          <div className="form">
            <Container
            groupName="1"
            getChildPayload={i => this.state.form2[i]}
              style={{ paddingBottom: '200px' }}
              dragClass="form-ghost"
              dropClass="form-ghost-drop"
              onDrop={(dropResult)=>{this.onDrop('form2',dropResult)}}
              nonDragAreaSelector=".field">
              {this.generateForm(this.state.form2)}
            </Container>
          </div>
        </div>
      </div>
    );
  }

  onDrop(formId,dropResult) {
    // return this.setState({ form: applyDrag(this.state.form, dropResult) });
    if(formId=='form1'){
      return this.setState({ form1: applyDrag(this.state.form1, dropResult) });
    }else{
      return this.setState({ form2: applyDrag(this.state.form2, dropResult) });
    }
  }

  generateForm(form) {
    console.dir(form);
    return form.map((item) => {
      return (
        <Draggable key={item.id}>
          <div
            className={`form-line`}>
            <div className="label">
              <span>{item.label}</span>
            </div>
            <div className="field">
              {item.element}
            </div>
          </div>
        </Draggable >
      );
    });
  }
}

export default Form;