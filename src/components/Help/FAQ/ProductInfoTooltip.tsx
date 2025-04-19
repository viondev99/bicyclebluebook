import * as React from 'react';
import { ReactNode } from 'react';

interface ToolTipState {
  isShow: boolean;
  onClose: () => void;
}

interface Props {
  renderTooltip: (tooltipState: ToolTipState) => Element | ReactNode;
  children?: ((a: any) => Element | ReactNode) | ReactNode;
  disabled?: boolean;
}

interface State {
  showModal: boolean;
}

class ProductInfoTooltip extends React.PureComponent<Props, State> {
  static defaultProps = {
    children: <i className="fas fa-info-circle" />,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  onShow = () => {
    if (!this.props.disabled) {
      this.setState({ showModal: true });
    }
  };

  onClose = () => {
    this.setState({ showModal: false });
  };

  onToggle = () => {
    this.setState((prev) => ({ showModal: !prev.showModal }));
  };

  render() {
    const { showModal } = this.state;
    const { renderTooltip, children } = this.props;
    return <>{renderTooltip({ isShow: showModal, onClose: this.onClose })}</>;
  }
}

export default ProductInfoTooltip;
