import React from 'react';
import { withRouter } from '@umijs/max';

const WithRouterExample = (props) => {
    return <div>
        <h4>WithRouterExample</h4>
        Hello World {props.location.pathname}
        <h2>params: {JSON.stringify(props.match.params)}</h2>
        </div>;
}



// export default WithRouterExample;
export default withRouter(WithRouterExample);