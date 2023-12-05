import React, { useRef, useState } from 'react'

type Props = {}

export default function Counter({ }: Props) {
    let ref = useRef(0);
    let demo1 = 0
    const [demo, setDemo] = useState(0)

    function handleClick() {
        ref.current = ref.current + 1;
        alert('You clicked ' + ref.current + ' times!');
        console.log(ref.current);
    }
    function handleClick3() {
        demo1++;
        console.log(demo1);
    }
	interface ModalProps {
		showModal: (params: { name: number }) => void;
	}
    const passRef = useRef<ModalProps>(null);
    // const passRef = useRef(null);
    const handleClick4 = ()=>{
        // console.dir(passRef.current!);
        passRef.current!.showModal({ name: 11 })
    }
    // let demo2 = useRef<String>('测试');
    let demo2 = useRef<String>('测试');
    const handleClick5 = ()=>{
        console.log(demo2.current);
    }
    return (
        <>
            <button onClick={handleClick}>
                变ref
            </button>
            <button onClick={() => { setDemo(demo + 1) }}>
                变状态
            </button>
            <button onClick={handleClick3}>
                变普通变量
            </button>
            <button onClick={handleClick4}>
                展示useRef
            </button>
            <button onClick={handleClick5}>
                展示useRef泛型
            </button>

        </>

    );
}