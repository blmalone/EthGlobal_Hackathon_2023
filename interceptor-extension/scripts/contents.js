const hijackWindowEthereum = function () {
  const hijackHandler = {
    get(target, prop, receiver) {
      const value = target[prop];
      if (value instanceof Function) {
        return async function (...args) {
          const method = args[0];
          if (method.method === "eth_sendTransaction") {
            const params = method.params;
            console.log("Sending params to snap", params);
            await window.ethereum.request({
              method: 'wallet_invokeSnap',
              params: { snapId: "local:http://localhost:8080", request: { method: method.method, params: params } },
            });
          } else {
            return value.apply(this === receiver ? target : this, args);
          }
        }
      } else {
        return value;
      }
    }
  };

  if (window.ethereum == null || window.ethereum == undefined) {
    setTimeout(hijackWindowEthereum, 350)
  } else {
    console.log("captured ethereum instance, setting proxy", window.ethereum);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    window.ethereum = new Proxy(window.ethereum, hijackHandler);
  }
};


window.addEventListener('load', function () {
  console.log("page loaded, adding hijack script");

  const script = document.createElement('script')
  script.text = `(${hijackWindowEthereum.toString()})();`
  document.documentElement.appendChild(script)
});
