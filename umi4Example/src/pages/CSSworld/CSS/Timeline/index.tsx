import React from 'react'
import './style.less'
import pic1 from '@/assets/acmi__exv1gmpbb5m6_large.jpg'
import pic2 from '@/assets/model_mba_m2__cfrbip6c05yq_large.jpg'

export default function Timeline(props) {
    return (
        <div>
            
            <div className="scroller">
                <div style={{height:'2000px'}}></div>
                <p>我是图片1，是不是很熟悉，专属配图：</p>
                <p><img loading="lazy" src={pic1}/></p>
                <p>最近上架新书作品封面图：</p>
                <p><img loading="lazy" src={pic2}/></p>
                <div style={{height:'2000px'}}></div>
            </div>
        </div>
    )
}
