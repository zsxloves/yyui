import React from 'react';

//定义props的类型
declare type Props = {
  onCancel: (falg?: boolean) => void;
  imgUrl: string;
};
const BigImageView: React.FC<Props> = (props) => {
  const { imgUrl, onCancel } = props;
  return (
    <div id="img_search_Modal" className="YYModal">
      <div className="YYModalTitle">照片</div>
      <div onClick={() => onCancel(false)} className="close">
        <i className="iconfont icon-guanbi" />
      </div>
      <div className="YYModalTable">
        <img id="img_search_big" src={imgUrl} />
      </div>
    </div>
  );
};
export default BigImageView;
