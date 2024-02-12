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

function onDragStart(a, b, c) {
  console.dir({ a, b, c })
}

function getChildPayload(a, b, c) {
  console.dir({ a, b, c })
}

export default function Demo1() {
  return (
    // <Container onDrop={onDrop} orientation="horizontal">
    <div className='smooth-container'>
    {/* <Container onDrop={onDrop} behaviour='move' groupName='con1'> */}
    {/* <Container onDrop={onDrop} lockAxis='y' dragClass='dragClass' dropClass='dropClass'> */}
    {/* <Container onDrop={onDrop} onDragStart={onDragStart}> */}
    {/* <Container onDrop={onDrop} orientation="horizontal">
       {data.map((item, i) => (
        <Draggable key={i}>
          <div className='smooth-item'>
            {item.label}
          </div>
        </Draggable>
      ))}
    </Container> */}
    <Container onDrop={onDrop} behaviour='contain'>
  {data.map((item) => (
    <Draggable>
      <div className='smooth-item'>
        {item.label}
      </div>
    </Draggable>
  ))}
</Container>
    </div>
      
    

  )
}
