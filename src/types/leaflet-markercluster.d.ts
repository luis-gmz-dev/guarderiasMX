import 'leaflet'

declare module 'leaflet.markercluster'

declare module 'leaflet' {
  interface MarkerClusterGroupOptions {
    showCoverageOnHover?: boolean
    maxClusterRadius?: number
    spiderfyOnMaxZoom?: boolean
    disableClusteringAtZoom?: number
  }

  interface MarkerClusterGroup extends FeatureGroup {
    clearLayers(): this
    addLayer(layer: Layer): this
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup
}
