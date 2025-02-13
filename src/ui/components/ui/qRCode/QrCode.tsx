import * as React from 'react';
import * as QrCode from 'qrcode';
import cn from 'classnames';

const DEFAULTS = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  rendererOpts: {
    quality: 0.5,
  },
  margin: 4,
  scale: 4,
  width: 100,
  height: 100,
  color: {
    dark: '#000000ff',
    light: '#ffffffff',
  },
};

type Options = typeof DEFAULTS;

const QrCodeImage = ({
  options,
  src,
  width,
  height,
  className,
  ...props
}: {
  options: Options;
  src: string;
  width?: number;
  height?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const isSvg = options.type === 'svg';
  const svgSource = !isSvg || !src ? null : { __html: src };

  return (
    <div className={className} {...props}>
      {isSvg ? (
        <div dangerouslySetInnerHTML={svgSource} />
      ) : (
        <img
          className={!src ? 'skeleton-glow' : null}
          srcSet={src}
          width={options.width}
          height={options.height}
        />
      )}
      {props.children}
    </div>
  );
};

type QRCodeProps = {
  errorCorrectionLevel?: string;
  type?: string;
  quality?: number;
  margin?: number;
  scale?: number;
  width?: number;
  height?: number;
  dark?: string;
  light?: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
};

export class QRCode extends React.PureComponent<QRCodeProps, State> {
  readonly state: State = {};

  render() {
    const state = this.state;

    const options = {
      errorCorrectionLevel: state.errorCorrectionLevel,
      type: state.type,
      color: {
        dark: state.dark,
        light: state.light,
      },
      rendererOpts: {
        quality: state.quality,
      },
      margin: state.margin,
      scale: state.scale,
      width: state.width,
      height: state.height,
    };

    if (state.hasChanged) {
      const method = options.type === 'svg' ? 'toString' : 'toDataURL';
      QrCode[method](state.text, options, (err, url) => {
        this.setState({ src: url });
      });
    }

    return (
      <QrCodeImage options={options} src={state.src} {...this.props}>
        {this.props.children}
      </QrCodeImage>
    );
  }

  getImg() {
    return this.state.src;
  }

  static getDerivedStateFromProps(nextProps, state) {
    const {
      errorCorrectionLevel = DEFAULTS.errorCorrectionLevel,
      type = DEFAULTS.type,
      quality = DEFAULTS.rendererOpts.quality,
      margin = DEFAULTS.margin,
      scale = DEFAULTS.scale,
      width = DEFAULTS.width,
      height = DEFAULTS.height,
      dark = DEFAULTS.color.dark,
      light = DEFAULTS.color.light,
      text = '',
      className = '',
      ...props
    } = nextProps;

    const rootClassName = cn(className);
    const hasChanged =
      !state ||
      state.text !== text ||
      state.width !== width ||
      state.height !== height;
    return {
      errorCorrectionLevel,
      type,
      quality,
      margin,
      scale,
      width,
      height,
      dark,
      light,
      className: rootClassName,
      hasChanged,
      text,
      ...props,
    };
  }
}

interface State {
  errorCorrectionLevel?: string;
  type?: string;
  quality?: number;
  margin?: number;
  scale?: number;
  width?: number;
  height?: number;
  dark?: string;
  light?: string;
  className?: string;
  hasChanged?: boolean;
  text?: string;
  src?: string;
}
