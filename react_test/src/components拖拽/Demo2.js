import React from 'react'
import { Container, Draggable } from 'react-smooth-dnd';

const data = [{
  label: 'a'
}, {
  label: 'b'
}, {
  label: 'c'
}]


function onDrop(a, b, c) {
  console.dir({ a, b, c })
}
export default function Demo2() {
  return (
    // <Container onDrop={onDrop} orientation="horizontal">
    <div className='smooth-container'>
      <Container onDrop={onDrop} behaviour='move' groupName='con1'>
        {data.map((item, i) => (
          <Draggable key={i}>
            <div className='smooth-item'>
              {item.label}
            </div>
          </Draggable>
        ))}
      </Container>
    </div>

  )
}
