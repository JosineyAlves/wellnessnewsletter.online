document.addEventListener("DOMContentLoaded", function () {

  function appendTrackingToLinks(trackingId) {
    document.querySelectorAll("a.buylink").forEach(function (link) {
      try {
        const url = new URL(link.href);

        url.searchParams.set("sub5", trackingId);

        link.href = url.toString();
      } catch (e) {
        console.warn("Invalid URL:", link.href);
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const fallbackTid = urlParams.get("_ef_transaction_id");

  if (typeof EF === "undefined" || !EF.click) {
    console.warn("Everflow not loaded");

    if (fallbackTid) {
      console.log("Using fallback _ef_transaction_id:", fallbackTid);
      appendTrackingToLinks(fallbackTid);
    }

    return;
  }

  EF.click({
    offer_id: EF.urlParameter("oid"),
    affiliate_id: EF.urlParameter("affid"),
    source_id: EF.urlParameter("source_id"),
    sub1: EF.urlParameter("sub1"),
    sub2: EF.urlParameter("sub2"),
    sub3: EF.urlParameter("sub3"),
    sub4: EF.urlParameter("sub4"),
    sub5: EF.urlParameter("sub5"),
    uid: EF.urlParameter("uid")
  }).then(function (tid) {

    const trackingId = tid || fallbackTid;

    if (!trackingId) {
      console.warn("No Everflow TID or _ef_transaction_id found");
      return;
    }

    console.log("Tracking ID used:", trackingId);
    appendTrackingToLinks(trackingId);

  }).catch(function (err) {
    console.error("Everflow click error:", err);

    if (fallbackTid) {
      console.log("Using fallback _ef_transaction_id after EF error:", fallbackTid);
      appendTrackingToLinks(fallbackTid);
    }
  });

});
