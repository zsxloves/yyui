import React from 'react';
import { Image } from 'antd';

//定义props的类型
declare type Props = {
  imgItem: any;
};
const IconOrImage: React.FC<Props> = (props) => {
  const { imgItem } = props;
  const flg = imgItem.icon.indexOf('/') === -1;
  return (
    <div style={{width:'30px'}}>
      {!flg && <Image preview={false} src={imgItem.icon} width={30}/>}
      {flg && <i className={`iconfont icon-${imgItem.icon}`} style={{ color: imgItem.color, fontSize:'30px' }} />}
    </div>
  );
};
export default IconOrImage;
