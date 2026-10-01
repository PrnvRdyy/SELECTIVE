/**
 * Creates a MutationObserver that watches for added nodes matching a selector.
 * Returns a disconnect function.
 */
export function observeDOM(
  target: Node,
  selector: string,
  callback: (elements: Element[]) => void,
  options?: { subtree?: boolean; attributes?: boolean }
): () => void {
  const observer = new MutationObserver((mutations) => {
    const matched: Element[] = [];

    for (const mutation of mutations) {
      // Check added nodes
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          if (node.matches(selector)) {
            matched.push(node);
          }
          // Also check descendants of added nodes
          const descendants = node.querySelectorAll(selector);
          matched.push(...descendants);
        }
      }

      // If watching attributes, check the target itself
      if (
        mutation.type === "attributes" &&
        mutation.target instanceof Element &&
        mutation.target.matches(selector)
      ) {
        matched.push(mutation.target);
      }
    }

    if (matched.length > 0) {
      callback(matched);
    }
  });

  observer.observe(target, {
    childList: true,
    subtree: options?.subtree ?? true,
    attributes: options?.attributes ?? false,
  });

  return () => observer.disconnect();
}

/**
 * Watches for URL changes in SPAs using popstate + pushState/replaceState interception.
 */
export function observeUrlChanges(callback: (url: string) => void): () => void {
  let lastUrl = location.href;

  const check = () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      callback(lastUrl);
    }
  };

  // Intercept history API
  const origPushState = history.pushState.bind(history);
  const origReplaceState = history.replaceState.bind(history);

  history.pushState = function (...args: Parameters<typeof origPushState>) {
    origPushState(...args);
    check();
  };

  history.replaceState = function (...args: Parameters<typeof origReplaceState>) {
    origReplaceState(...args);
    check();
  };

  window.addEventListener("popstate", check);

  // Also poll as fallback for edge cases (YouTube uses yt-navigate-finish events)
  const interval = setInterval(check, 1000);

  return () => {
    history.pushState = origPushState;
    history.replaceState = origReplaceState;
    window.removeEventListener("popstate", check);
    clearInterval(interval);
  };
}

/**
 * Hides elements matching a CSS selector. Returns a function to unhide them.
 */
export function hideElements(selector: string): () => void {
  const styleId = `sc-hide-${btoa(selector).replace(/[^a-zA-Z0-9]/g, "")}`;

  // Don't double-inject
  if (document.getElementById(styleId)) return () => removeStyle(styleId);

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `${selector} { display: none !important; }`;
  document.head.appendChild(style);

  return () => removeStyle(styleId);
}

function removeStyle(id: string): void {
  document.getElementById(id)?.remove();
}
