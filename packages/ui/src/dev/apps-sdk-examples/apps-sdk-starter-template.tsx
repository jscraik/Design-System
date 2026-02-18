import {
  AppsSdkCarouselExample,
  AppsSdkFullscreenExample,
  AppsSdkInlineExample,
  AppsSdkInspectorExample,
  AppsSdkPipExample,
} from "./index";

export function AppsSdkStarterTemplate() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="text-card-title">Inline list</div>
        <AppsSdkInlineExample />
      </section>

      <section className="space-y-3">
        <div className="text-card-title">Carousel</div>
        <AppsSdkCarouselExample />
      </section>

      <section className="space-y-3">
        <div className="text-card-title">Inspector</div>
        <AppsSdkInspectorExample />
      </section>

      <section className="space-y-3">
        <div className="text-card-title">Fullscreen</div>
        <AppsSdkFullscreenExample />
      </section>

      <section className="space-y-3">
        <div className="text-card-title">PiP</div>
        <AppsSdkPipExample />
      </section>
    </div>
  );
}

export function AppsSdkStarterTemplateAlt() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <div className="text-card-title">Compact inline list</div>
        <AppsSdkInlineExample />
      </section>

      <section className="space-y-3">
        <div className="text-card-title">Carousel + PiP</div>
        <AppsSdkCarouselExample />
        <div className="pt-4">
          <AppsSdkPipExample />
        </div>
      </section>

      <section className="space-y-3">
        <div className="text-card-title">Inspector + Fullscreen</div>
        <AppsSdkInspectorExample />
        <AppsSdkFullscreenExample />
      </section>
    </div>
  );
}
