import {
  h, Component, State, Prop, Watch, Host, Event, EventEmitter,
} from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { findRootPlayer } from '../../core/player/utils';

@Component({
  tag: 'vime-spinner',
  styleUrl: 'spinner.scss',
})
export class Spinner {
  @State() isHidden = true;

  @State() isActive = false;

  @State() currentProvider?: string;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /**
   * @internal
   */
  @Prop() ready: PlayerProps['ready'] = false;

  @Watch('ready')
  async onReadyChange() {
    const player = findRootPlayer(this);
    const provider = await player.getProvider();
    this.currentProvider = provider.nodeName;
  }

  /**
   * Emitted when the spinner will be shown.
   */
  @Event({ bubbles: false }) vWillShow!: EventEmitter<void>;

  /**
   * Emitted when the spinner will be hidden.
   */
  @Event({ bubbles: false }) vWillHide!: EventEmitter<void>;

  @Watch('isVideoView')
  onVideoViewChange() {
    this.isHidden = !this.isVideoView;
    this.onVisiblityChange();
  }

  /**
   * @internal
   */
  @Prop() buffering: PlayerProps['buffering'] = false;

  @Watch('buffering')
  onActiveChange() {
    this.isActive = this.buffering;
    this.onVisiblityChange();
  }

  private onVisiblityChange() {
    (!this.isHidden && this.isActive) ? this.vWillShow.emit() : this.vWillHide.emit();
  }

  render() {
    return (
      <Host
        class={{
          hidden: this.isHidden || (this.currentProvider === 'VIME-YOUTUBE'),
          active: this.isActive,
        }}
      >
        <div>Loading...</div>
      </Host>
    );
  }
}

withPlayerContext(Spinner, [
  'isVideoView',
  'buffering',
  'ready',
]);
