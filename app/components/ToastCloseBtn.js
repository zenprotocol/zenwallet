// @flow
import * as React from 'react'

import { CLOSE_TOAST_ICON_SRC } from '../constants/imgSources'

type Props = {
  closeToast: () => {}
};

const ToastCloseBtn = ({ closeToast }: Props) => (
  <img onClick={closeToast} src={CLOSE_TOAST_ICON_SRC} className="Toastify__close-button" alt="close" />
)

export default ToastCloseBtn
