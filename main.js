import { Niivue } from '@niivue/niivue'
async function main() {
      about.onclick = function () {
        window.alert("Experimental diffusion tensor V1 validation (to do: assumptions regarding neurological convention, slice orientation, world space)")
      }
      saveBmp.onclick = function () {
        nv1.saveScene("ScreenShot.png")
      }
      function minMax() {
        let mn = 0.01 * slide.value
        let mx = 0.01 * slideX.value
        nv1.volumes[0].cal_min = Math.min(mn, mx)
        nv1.volumes[0].cal_max = Math.max(mn, mx)
        nv1.updateGLVolume()
      }
      slide.oninput = function () {
        minMax()
      }
      slideX.oninput = function () {
        minMax()
      }
      checkColorDef.onchange = function () {
        nv1.isColorDeficiency = this.checked
        nv1.updateGLVolume()
      }
      check.onchange = function () {
        nv1.isAlphaClipDark = this.checked
        nv1.updateGLVolume()
      }
      function handleLocationChange(data) {
        document.getElementById("location").innerHTML =
          "&nbsp;&nbsp;" + data.string
      }
      var volumeList1 = [
        {
          url: "FA.nii.gz",
          opacity: 1,
          visible: false,
        },
        {
          url: "V1.nii.gz",
          opacity: 0.0,
          visible: false,
        },
      ]
      var nv1 = new Niivue({ 
        backColor: [0.0, 0.0, 0.2, 1],
        show3Dcrosshair: true,
        onLocationChange: handleLocationChange,
      })
      nv1.opts.dragMode = nv1.dragModes.pan
      nv1.opts.yoke3Dto2DZoom = true
      nv1.setCrosshairWidth(0.1)
      //v1 aided if all views show voxel centers
      nv1.opts.isForceMouseClickToVoxelCenters = true
      nv1.attachTo("gl1")
      //V1 lines REQUIRES nearest neighbor interpolation
      nv1.setInterpolation(true)
      await nv1.loadVolumes(volumeList1)
      if (true) {
        //make colorblind volume
        await nv1.volumes.push(nv1.volumes[1].clone())
        let img = nv1.volumes[2].img
        for (let i = 0; i < nv1.volumes[2].img.length; i += 4) {
          let r = img[i+0]
          let g = img[i+1]
          let b = img[i+2]
          if ((r > g) && (r > g)) {
            g = r //make red yellowish
          } else if (g > b) {
            b = g //make green cyanish
          }
          img[i+1] = g
          img[i+2] = b
        }
        nv1.updateGLVolume()
      }
      nv1.scene.crosshairPos = nv1.vox2frac([41, 46,28])
      modeSelect.onchange = function () {
        let mode = modeSelect.selectedIndex
        nv1.setOpacity(2, 0.0) //hide V1-colorblind
        if (mode === 0) {
          nv1.setOpacity(0, 1.0) //show FA
          nv1.setOpacity(1, 0.0) //hide V1
        } else if (mode > 2) {
          nv1.setOpacity(0, 1.0) //show FA
          nv1.setOpacity(1, 1.0) //show V1
        } else {
          nv1.setOpacity(0, 0.0) //hide FA
          nv1.setOpacity(1, 1.0) //show V1
        }
        if ((mode === 4) || (mode === 2)) {
          nv1.setModulationImage(nv1.volumes[1].id,nv1.volumes[0].id)
        } else nv1.setModulationImage(nv1.volumes[1].id, '')
        if (mode === 5) {
          nv1.setOpacity(0, 0.0) //hide FA
          nv1.setOpacity(1, 0.0) //hide V1
          nv1.setOpacity(2, 1.0) //show V1 colorblind
          nv1.setModulationImage(nv1.volumes[2].id,nv1.volumes[0].id)
        }
        nv1.opts.isV1SliceShader = ((mode > 2) && (mode < 5))
        nv1.updateGLVolume()
      }
      modeSelect.onchange()
      check.onchange()
}

main()
