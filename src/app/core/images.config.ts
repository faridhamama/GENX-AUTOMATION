/**
 * Central image configuration.
 *
 * ── HOW TO UPDATE IMAGES (non-technical guide) ──────────────────────────────
 * 1. Upload the new image somewhere (Google Drive public link, your website
 *    hosting, Supabase Storage, etc.) and copy the direct image URL.
 * 2. Find the key that matches the image you want to replace (see labels below).
 * 3. Paste the new URL between the single quotes, replacing the old one.
 * 4. Save the file. The app will show the new image automatically.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const IMAGES = {
  home: {
    /** Background blueprint overlay on the hero section */
    heroBg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2dxqGCwONNr25xFWNUraAxL0-ns8QAzHG_e4-FhubR7fZg_F5WvgrceTYPBlfWw29-Afgj9BLvELlfcWJ7NCgI6KEENJjOCnw19lWNkPVLjENMkgfGuzgr-2BK5RwieWod3nYBzgAPbGPPCCoQzK4oSCHmDu3rrn7qm2DBP5mCxuudL2ornwSkjKQut4qyNbecE9_0G-AM8UfFK9LdAWjzCIsGwfBv5clju-UK9E6848h5n8QWA6En31BaX-bwdiguJy5jGy5yV4',

    /** Circuit board close-up shown in the hero stats grid */
    circuitBoard:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBUCLNJUDTkTF6Hf_P8K361eiGMi-0JT4gg7b9zyoKdK7rRyh3SzjI-XNeLNhBeqD9Ftl5w_z9ARNwaGsaZTvh8V2_YjKY0enhkXvmAzitp1AHFSNz0SAUC2JG4NveIOWKoIZSwDeQIFJ9liZ8ldp_oN-rbQeNKKF2U6gnKhUd6Wo1cvaILfoAPBLIPvv56Y3E_ijCR9ZzDm1nyakEHmM9B16ZG7GoA4nvXEq_MUx_4562Bic9b78NIR1__hIRZWTf7XOcdi3RMljk',

    /** Industrial production line — "Industrial Automation" expertise card */
    industrialLine:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkW8jNo7cIVE4cWJmtIcb8axnrXx__bvbwZdAObMVgsEuHTGgFdeiS-UkY2akY4VT6km0BWUA_YBO2auiJAd-DVNAHAPSCxL6qXSp1GuxuKNDzl6EXggpR7WhrHC4T_GOFUuCynfUMbX-4SfF1jRfrkyzDE5u9QCORm2H0zbNQYaDHnt2Y1q-3Cfog9H8hxlA9JV-p_IyER32eW8MgzA7HzYLC2sFDYOnGdB5sHLH9Ls3-5EyDmDogH59WdS9oExepJ18yKaH-LHs',

    /** Telecom router — "Télégestion & IoT" expertise card */
    iotRouter:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKzR_s-yyWsjsUpRwDgUUkZPwWMUBmtEhvOTaXUUz13ZaAu_qxx8i1piz4GWht0LYxuuHONmsd0owM9OWYTjGImeK1vZWLnF80RXxtGAfsAEhoGWgamAC3md-OHxlKQN34wZCc4Pf5vHmcAsflIODGbToLuhCYHHwqoKWmfuqT7or55TWGcrZx4RxtDwy4RCkVWoWSEUcbPyUGUnIA1zWK-_Lc6ZubPGwm2NB2LW6pRb4FZwGMCBEqyTDLXfL2kPnQ34tQ4jlTfmw',
  },

  about: {
    /** Industrial control panel with blue indicators — "À Propos" bento grid */
    controlPanel:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBaVEahFDU-zQLI7VfsB-GDwfunjEw4uTX8q-4UZBcIoQr1jeQ90tn1Bnahs9cishiUa738hdbyKNMQ34zbSQIFAWoQuwmu2dscRI4MceqksvFKPKUijI-4rU_GQRUvbwPNFfYOK-tXaitBPfZkTyOcz-bnw-DnqZOnXsRsSHOT8fgJEkTTk_Uw3n79qCVCqz9VmGtIDsSgSU_Xu3pAtRdWFpNj6xDf-6epGVGEzTLFjALYniAoaCUs477tmbTFrIdcWChPHuWd8ps',
  },

  references: {
    /** Featured project image — AEP Smir PLC control panel */
    featuredProject:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0_em_wwoYBYGzsJbpS05iggiqvc0AmbNGLFm8tNNU1kPYUaRDPmmVPX9mfsS2GyIRNHTNKSwaWLEEuM8L8rzjGDrPLrLWYv_WunVGQLPZMPnwPqzM8HrrFkoE60OfRQth3NU_LgjLq0CXRUBJiZazuHv1cjlfr8DYyI3wfma_c8DmUJe44jflMhhyasuFVh0M4OpF289-7rs0wmCTJqDF25K1y5lgRuMwAxsezGJ6gF3GHocH0rXVK5xlENft95sNS1qzI7v9p8w',

    /** Server room image — "Pourquoi la Précision GENX?" section */
    serverRoom:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVGgjtmUOkUh3y-ZaUooSey3iicof2-cJkvvpOY9sSFONHZNoplaEo6v37IZHdkxgDrnOnZgGe-jYqUI0jmZoPdbxFZ5EGASRmPloVO1fOEwvMAvVuUYEElCXPpUm-u5yWIG-GptW3FYw1JMhq3kR9bG2uFLJQwYwtcBjq12d25bM-slRx6X__SeQGLRT8y1KHBuB3Qp5ySzOSGfE7pp6tYOgvMfwLd6m2OjF3MfioIt0EZV4AJ1OCaxTmzm_dI0zZZJPlscthqBY',
  },

  contact: {
    /** Office / HQ photo shown next to the quote form */
    hqOffice:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1bvnaBMIJ0FZ-t8SgiyaHdaRGFNG62Jc5W6vPpcczhvY68uAL_DSkIV86-F27hfl4A4vrYy2PwWkZzEpEuW91fA_oAbhGnzA-O9Opik8S4xdSjuWljhbS9YyqQrubpbEqupWYO52msEDIdtYQkqmscZNk6wX2KShLBmPfWHYdSSwD_vlXsSMuwXPLkRKil4f7PKhH-kmVqr-zVw2r4ITEIXGW-6-i-ZFgf3pKHOpxfNpksNxDeJwcWO2LDNYa1eUvjHsGqZ-6gtc',
  },
} as const;
