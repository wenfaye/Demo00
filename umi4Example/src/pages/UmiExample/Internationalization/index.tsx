import { FormattedMessage, useIntl } from '@umijs/max'
import { Alert } from 'antd';
import React from 'react';
import styled from 'styled-components';

/**
 * 
 */
const Internationalization = () => {
    const intl = useIntl();
    const msg = intl.formatMessage({
      id: 'welcome',
    });
    return (<div>
        <FormattedMessage id="welcome" />
        <Alert message={msg} type="success" />
        <FormattedMessage id="user.welcome" values={{ name: '张三' }} />
    </div>);
}


export default Internationalization;