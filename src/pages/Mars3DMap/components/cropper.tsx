import React, { useState, MouseEvent, FunctionComponent } from 'react';
import styles from './cropper.less'
import Cropper from 'cropperjs';
import {Button} from 'antd'
/**
 * 图片剪切
 * 参考：https://github.com/fengyuanchen/cropperjs
 * @param props
 */
interface IProps {
  /** 获取图片配置选项 */
  options?: Cropper.GetCroppedCanvasOptions;
  /** 是否显示 */
  /** 待剪切的原始图片 */
  url?: string;
  /** 剪切完成 */
  onCropSuccess?: (dataUrl: string) => void;
  /** 取消 */
  onCancel?: () => void;
}
const Cropping: FunctionComponent<IProps> = (props) => {
  const { url = '', onCropSuccess = () => { }, onCancel = () => { } } = props;
  // 图片裁剪实例
  const [cropper, setCropper] = useState<Cropper>();
 
  // 初始化待裁剪图片
  const onLoadImg = (e: MouseEvent<HTMLImageElement>) => {
    const ins = new Cropper(e.currentTarget, {
    //   aspectRatio: 1 / 2, // 宽高比
      viewMode: 1, // 视图控制：1-限制裁剪框不能超出图片的范围
      dragMode: 'move', // 拖拽模式：move-图片可移动
      autoCropArea: 0.8, // 裁剪区域占图片的大小（0~1）
      cropBoxMovable: true, // 是否可以拖拽剪切框
      cropBoxResizable: true, // 是否可以改变剪切框的尺寸
      background: true, // 是否显示网格状背景
      scalable: true, // 是否可以缩放图片（改变宽高）
      toggleDragModeOnDblclick: false, // 是否可以通过双击切换拖拽图片模式
    });
    setCropper(ins);
  };
 
  // 点击完成
  const cropComplete = () => {
    const data = cropper?.getCroppedCanvas();
    if (data) {
      onCropSuccess?.call(null, data.toDataURL('image/jpeg'));
    }
  };
 
  return (
    <div className={styles.cropAll}>
        <div className={styles.crop_box}>
        {/* 45为头部的高度（可能需要判断是否显示头部），65为底部的高度 */}
        <div style={{ height: '443rem' }}>
            <img src={url} onLoad={(e: MouseEvent<HTMLImageElement>) => { onLoadImg(e); }} alt="" />
        </div>
        <div className={styles.crop_box_actions}>
            <Button onClick={() => onCancel?.call(null)}>取消</Button>
            <Button type="primary" onClick={() => { cropComplete(); }}>完成</Button>
        </div>
        </div></div>
  );
};
 
export default Cropping;