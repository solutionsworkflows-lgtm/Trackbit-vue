(() => {
    "use strict";

    const modules = {
        262: (module, exports) => {
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.RandomGenerator = class {
                static pickRandomItem(array) {
                    return array[Math.floor(Math.random() * array.length)];
                }
            };
        },
        745: (module, exports) => {
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.UnicodeEncoder = class {
                static encodeNumbers(text) {
                    return text.replace(/[0-9]/g, (match) => UnicodeEncoder.encodingMap[match]);
                }

                static decodeNumbers(text) {
                    const encodedChars = Object.values(UnicodeEncoder.encodingMap).join("");
                    const pattern = new RegExp(`[${encodedChars}]`, "g");
                    return text.replace(pattern, (char) => {
                        return Object.keys(UnicodeEncoder.encodingMap).find(
                            (key) => UnicodeEncoder.encodingMap[key] === char
                        ) || "";
                    });
                }

                static encodeAndInsert(id, text, position = 1) {
                    const encodedId = UnicodeEncoder.encodeNumbers(id);
                    return `${text.slice(0, position)}${encodedId}${text.slice(position)}`;
                }

                static decodeAndExtract(text) {
                    const encodedChars = Object.values(UnicodeEncoder.encodingMap).join("");
                    const pattern = new RegExp(`[${encodedChars}]`, "g");
                    let extractedId = "";

                    text.replace(pattern, (char) => {
                        const digit = Object.keys(UnicodeEncoder.encodingMap).find(
                            (key) => UnicodeEncoder.encodingMap[key] === char
                        );
                        if (digit) extractedId += digit;
                        return char;
                    });

                    return extractedId !== "" ? extractedId : null;
                }

                static removeEncodedChars(text) {
                    const encodedChars = Object.values(UnicodeEncoder.encodingMap).join("");
                    const pattern = new RegExp(`[${encodedChars}]`, "g");
                    return text.replace(pattern, "");
                }
            };

            exports.UnicodeEncoder.encodingMap = {
                0: "â€‹", 1: "â€Œ", 2: "â€", 3: "â ",
                4: "â¡", 5: "â¢", 6: "â£", 7: "â¤",
                8: "â€ª", 9: "â€¬"
            };
        },
        202: (module, exports, require) => {
            Object.defineProperty(exports, "__esModule", { value: true });
            const { RandomGenerator } = require(262);
            const { UnicodeEncoder } = require(745);

            exports.UrlProcessor = class {
                static randomizePhoneIfNeeded(url) {
                    const phoneNumbers = window.phones || [];
                    if (phoneNumbers.length === 0) return url;

                    const randomPhone = RandomGenerator.pickRandomItem(phoneNumbers);

                    if (url.includes("phone=")) {
                        return UrlProcessor.replaceQueryParam(url, "phone", randomPhone);
                    } else if (url.includes("wa.me")) {
                        return `https://wa.me/${randomPhone}?${url.split("?")[1]}`;
                    }
                    return url;
                }

                static insertAdIdInWhatsAppUrl(url, adId) {
                    const defaultText = "Olá";
                    const textParam = UrlProcessor.getQueryParams(url).get("text") || defaultText;
                    const cleanAdId = adId.replace(/[^0-9]/g, "");
                    const cleanText = UnicodeEncoder.removeEncodedChars(textParam);
                    const newText = UnicodeEncoder.encodeAndInsert(cleanAdId, cleanText);

                    return UrlProcessor.replaceQueryParam(url, "text", newText);
                }

                static extractAdId(params) {
                    const content = params.get("utm_content") || "";
                    return content.includes("|") ? content.split("|")[1] : null;
                }

                static getQueryParams(url) {
                    const queryString = url.split("?")[1];
                    return new URLSearchParams(queryString);
                }

                static replaceQueryParam(url, paramName, paramValue) {
                    const baseUrl = url.split("?")[0];
                    const queryString = url.split("?")[1];
                    const params = new URLSearchParams(queryString);

                    params.set(paramName, paramValue);
                    return `${baseUrl}?${params.toString()}`;
                }

                static cleanSpecialChars(text) {
                    return text
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^\w\s-|]/gi, "")
                        .replace(/\s/g, "");
                }
            };
        }
    };

    const moduleCache = {};

    function requireModule(moduleId) {
        if (moduleCache[moduleId]) return moduleCache[moduleId].exports;

        const module = moduleCache[moduleId] = { exports: {} };
        modules[moduleId](module, module.exports, requireModule);
        return module.exports;
    }

    (() => {
        const { UrlProcessor } = requireModule(202);
        console.log("wetrackr script loaded! 2.3.12");

        const config = {
            ignoreAllIframes: !!document.querySelector("[data-wetrackr-ignore-iframe]"),
            ignoreRetry: !!document.querySelector("[data-wetrackr-ignore-retry]"),
            fastInit: !!document.querySelector("[data-wetrackr-fast-init]"),
            encodeSpaces: !!document.querySelector("[data-wetrackr-encode-spaces]"),
            isClickBank: !!document.querySelector("[data-wetrackr-is-clickbank]"),
            blockSubIds: !!document.querySelector("[data-wetrackr-block-subids]"),
            fixShopify: !!document.querySelector("[data-wetrackr-fix-shopify]"),
            ignoreClasses: document.querySelector("[data-wetrackr-ignore-classes]")
                ?.getAttribute("data-wetrackr-ignore-classes")?.split(" ").filter(Boolean) || [],
            linkReplaceSelector: document.querySelector("[data-wetrackr-replace-links]")
                ?.getAttribute("data-wetrackr-replace-links"),
            isCartPanda: !!document.querySelector("[data-wetrackr-is-cartpanda]"),
            blockXcodSck: !!document.querySelector("[data-wetrackr-block-xcod-sck]")
        };

        const vendors = {
            Doppus: "doppus",
            VideoPlatforms: {
                PandaVideo: "pandavideo.com",
                YouTube: "youtube.com",
                Eplay: "eplay.video",
                Vimeo: "vimeo.com"
            }
        };

        const utmParams = [
            "utm_source", "utm_campaign", "utm_medium",
            "utm_content", "utm_term"
        ];

        class TrackingManager {
            static addTrackingParams(url) {
                const baseUrl = TrackingManager.getBaseUrl(url);
                const existingParams = TrackingManager.getUrlParams(url);
                const trackingParams = TrackingManager.getTrackingParams();
                const combinedParams = new URLSearchParams();

                existingParams.forEach((value, key) => combinedParams.append(key, value));
                trackingParams.forEach((value, key) => combinedParams.append(key, value));

                const uniqueParams = TrackingManager.removeDuplicateParams(combinedParams);
                const simplifiedParams = TrackingManager.simplifyParams(baseUrl, uniqueParams);
                const encodedParams = config.encodeSpaces
                    ? simplifiedParams.toString().split("+").join("%20")
                    : simplifiedParams.toString();

                const separator = baseUrl.includes("?") ? "&" : "?";
                return `${baseUrl}${separator}${encodedParams}`;
            }

            static getBaseUrl(url) {
                return url.split("?")[0];
            }

            static getUrlParams(url) {
                if (!url) return new URLSearchParams();
                const urlObj = url instanceof URL ? url.href : url;
                if (!urlObj.includes("?")) return new URLSearchParams();

                const parts = urlObj.split("?");
                if (parts.length <= 1) return new URLSearchParams();

                return new URLSearchParams(parts[1]);
            }

            static removeDuplicateParams(params) {
                const keys = Array.from(params.keys());
                const uniqueValues = new Map();

                keys.forEach(key => {
                    const values = params.getAll(key);
                    uniqueValues.set(key, values[values.length - 1]);
                });

                const result = new URLSearchParams();
                uniqueValues.forEach((value, key) => result.append(key, value));
                return result;
            }

            static getTrackingParams() {
                const separator = "hQwK21wXxR";
                const urlParams = new URLSearchParams(window.location.search);

                function getParamValue(paramName) {
                    const urlValue = urlParams.get(paramName);
                    if (urlValue && urlValue !== "null" && urlValue !== "undefined" && urlValue !== "") {
                        return urlValue;
                    }

                    const storedValue = localStorage.getItem(paramName);
                    if (!storedValue) return "";

                    const expirationKey = getExpirationKey(paramName);
                    const expiration = localStorage.getItem(expirationKey);

                    if (!expiration || new Date(expiration) < new Date()) {
                        localStorage.removeItem(paramName);
                        localStorage.removeItem(expirationKey);
                        return "";
                    }

                    return storedValue;
                }

                function joinValues(values, delimiter) {
                    return values.join(delimiter);
                }

                const term = getParamValue("utm_term");
                const content = getParamValue("utm_content");
                const medium = getParamValue("utm_medium");
                const campaign = getParamValue("utm_campaign");
                const source = (function(baseSource) {
                    const leadId = (function() {
                        const leadData = localStorage.getItem("lead") || localStorage.getItem("lead-google");
                        if (!leadData) return null;
                        const parsedData = JSON.parse(leadData);
                        return parsedData?._id || null;
                    })();

                    return leadId
                        ? baseSource.includes("jLj")
                            ? baseSource
                            : `${baseSource}jLj${leadId}`
                        : baseSource;
                })(getParamValue("utm_source"));

                const gclid = getParamValue("gclid");
                const params = new URLSearchParams();
                const cid = getParamValue("cid");

                if (config.isCartPanda) {
                    params.set("cid", cid || Math.round(1e11 * Math.random()).toString());
                } else if (cid) {
                    params.set("cid", cid);
                }

                if (gclid) params.set("gclid", gclid);
                params.set("utm_source", source);
                params.set("utm_campaign", campaign);
                params.set("utm_medium", medium);
                params.set("utm_content", content);
                params.set("utm_term", term);

                if (config.isClickBank) {
                    params.set("aff_sub1", UrlProcessor.cleanSpecialChars(source));
                    params.set("aff_sub2", UrlProcessor.cleanSpecialChars(campaign).replace(/\|(?=\d{10,}$)(?!.*\|)/, "cKBk"));
                    params.set("aff_sub3", UrlProcessor.cleanSpecialChars(medium).replace(/\|(?=\d{10,}$)(?!.*\|)/, "cKBk"));
                    params.set("aff_sub4", UrlProcessor.cleanSpecialChars(content).replace(/\|(?=\d{10,}$)(?!.*\|)/, "cKBk"));
                    params.set("aff_sub5", UrlProcessor.cleanSpecialChars(term));
                } else if (!config.blockSubIds) {
                    params.set("subid", UrlProcessor.cleanSpecialChars(source));
                    params.set("sid2", UrlProcessor.cleanSpecialChars(campaign));
                    params.set("subid2", UrlProcessor.cleanSpecialChars(campaign));
                    params.set("subid3", UrlProcessor.cleanSpecialChars(medium));
                    params.set("subid4", UrlProcessor.cleanSpecialChars(content));
                    params.set("subid5", UrlProcessor.cleanSpecialChars(campaign));
                }

                const src = getParamValue("src");
                if (src) params.set("src", src);

                const paramValues = [source, campaign, medium, content, term];
                const allEmpty = paramValues.every(value => value === "");
                const xcod = getParamValue("xcod");
                const sck = getParamValue("sck");

                if (config.blockXcodSck) {
                    if (xcod) params.set("xcod", xcod);
                    if (sck) params.set("sck", sck);
                } else {
                    const combinedValue = joinValues(paramValues, separator);
                    const processedValue = (function(value, maxLength, delimiter) {
                        if (value.length <= maxLength) return value;

                        const segmentLength = Math.floor(maxLength / 5);

                        function processSegment(segment, isComplex, subDelimiter) {
                            if (!isComplex) return segment.substring(0, segmentLength) + "...";

                            const parts = segment.split(subDelimiter || "|");
                            const lastPart = parts.length > 1 ? parts[parts.length - 1] : "";
                            const mainParts = parts.length > 1 ? parts.slice(0, -1) : parts;

                            return `${mainParts.join(subDelimiter).substring(0, segmentLength)}...${subDelimiter}${lastPart}`;
                        }

                        const [srcPart, campPart, medPart, contPart, termPart] = value.split(delimiter);

                        return [
                            processSegment(srcPart, true, "jLj"),
                            processSegment(campPart, true),
                            processSegment(medPart, true),
                            processSegment(contPart, true),
                            processSegment(termPart, false)
                        ].join(delimiter);
                    })(allEmpty ? (xcod || src || "") : combinedValue, 255, separator);

                    params.set("xcod", processedValue);
                    params.set("sck", processedValue);
                }

                const fbclid = urlParams.get("fbclid");
                if (fbclid) params.set("fbclid", fbclid);

                const utmId = getParamValue("utm_id");
                if (utmId) params.set("utm_id", utmId);

                const shouldMarkAsOrganic = (function() {
                    const isEmpty = value => !value || value === "";
                    return (
                        isEmpty(params.get("utm_source")) &&
                        isEmpty(params.get("utm_medium")) &&
                        isEmpty(params.get("utm_campaign")) &&
                        isEmpty(params.get("utm_content")) &&
                        isEmpty(params.get("utm_term")) &&
                        isEmpty(params.get("xcod")) &&
                        isEmpty(params.get("src")) &&
                        isEmpty(params.get("fbclid"))
                    );
                })();

                if (shouldMarkAsOrganic) {
                    params.set("utm_source", "organic");
                }

                window.trackingParams = params;
                return params;
            }

            static simplifyParams(url, params) {
                if (!Object.values(vendors).some(vendor => url.includes(vendor))) {
                    return params;
                }

                const simplified = new URLSearchParams();
                params.forEach((value, key) => {
                    if (utmParams.includes(key)) {
                        simplified.append(key, value);
                    }
                });
                return simplified;
            }
        }

        window.trackingParamNames = [
            "utm_source", "utm_campaign", "utm_medium",
            "utm_content", "utm_term", "xcod", "src"
        ];
        window.trackingExpirationDays = 7;

        const requiredParams = [
            "utm_source", "utm_campaign", "utm_medium",
            "utm_content", "xcod", "sck"
        ];

        function getExpirationKey(key) {
            return `${key}_exp`;
        }

        function initializeTracking() {
            function processLinks(checkExistingParams) {
                document.querySelectorAll("a").forEach(link => {
                    const shouldIgnore =
                        link.href.startsWith("mailto:") ||
                        link.href.startsWith("tel:") ||
                        link.href.includes("#") ||
                        config.ignoreClasses.some(className => link.classList.contains(className));

                    if (shouldIgnore) return;

                    const href = link.href;
                    const isWhatsAppLink = [
                        "wa.me/", "api.whatsapp.com/send",
                        "whatsapp:", "link.dispara.ai/",
                        "random.lailla.io/"
                    ].some(pattern => href.includes(pattern));

                    if (isWhatsAppLink) {
                        const params = TrackingManager.getTrackingParams();
                        const adId = UrlProcessor.extractAdId(params);
                        link.href = UrlProcessor.randomizePhoneIfNeeded(href);
                        link.href = UrlProcessor.insertAdIdInWhatsAppUrl(href, adId || "");
                        return;
                    }

                    if (checkExistingParams && requiredParams.every(param => href.includes(param))) {
                        return;
                    }

                    link.href = TrackingManager.addTrackingParams(href);

                    if (config.linkReplaceSelector) {
                        replaceElementIfNeeded(link, {
                            property: "href",
                            value: config.linkReplaceSelector
                        });
                    }
                });
            }

            function processForms(checkExistingParams) {
                document.querySelectorAll("form").forEach(form => {
                    const shouldIgnore =
                        (checkExistingParams && requiredParams.every(param => form.action.includes(param))) ||
                        config.ignoreClasses.some(className => form.classList.contains(className));

                    if (shouldIgnore) return;

                    form.action = TrackingManager.addTrackingParams(form.action);

                    TrackingManager.getTrackingParams().forEach((value, name) => {
                        const existingInput = form.querySelector(`input[name="${name}"]`);
                        if (existingInput) {
                            existingInput.setAttribute("value", value);
                            return;
                        }

                        const newInput = createHiddenInput(name, value);
                        form.appendChild(newInput);
                    });
                });
            }

            function replaceElementIfNeeded(element, matchCondition) {
                if (element.getAttribute("data-replaced") === "true") return;
                if (matchCondition && !element[matchCondition.property]?.includes(matchCondition.value)) return;

                const newElement = document.createElement(element.tagName);
                for (const attr of element.attributes) {
                    newElement.setAttribute(attr.name, attr.value);
                }
                newElement.setAttribute("data-replaced", "true");
                newElement.innerHTML = element.innerHTML;

                element.parentNode?.replaceChild(newElement, element);
            }

            function createHiddenInput(name, value) {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = name;
                input.value = value;
                return input;
            }

            function saveTrackingParams() {
                const urlParams = new URLSearchParams(window.location.search);
                window.trackingParamNames.forEach(param => {
                    const value = urlParams.get(param);
                    if (value) {
                        localStorage.setItem(param, value);
                        const expiration = new Date(
                            new Date().getTime() + 24 * window.trackingExpirationDays * 60 * 60 * 1000
                        );
                        localStorage.setItem(getExpirationKey(param), expiration.toISOString());
                    }
                });
            }

            const isShopifyTheme = (function() {
                const { fixShopify } = config;
                const themeName =
                    window.BOOMR?.themeName ||
                    window.Shopify?.theme?.schema_name;

                if (!themeName) return fixShopify;

                const themeChecks = {
                    isDropmeta: themeName.includes("Dropmeta"),
                    isWarehouse: themeName.includes("Warehouse"),
                    isClassic: themeName.includes("Classic®"),
                    isVision: themeName.includes("Tema Vision"),
                    isSabino: themeName.includes("Waresabino"),
                    isDawn: themeName.includes("Dawn"),
                    isVortex: themeName.includes("Vortex"),
                    isWarepro: themeName.includes("Warepro"),
                    isImadigital: themeName.includes("Wareimadigital"),
                    isMercadoLivre: themeName.includes("Mercado Livre"),
                    isEvolution: themeName.includes("Tema Evolution®"),
                    isEnterprise: themeName.includes("Evolution Enterprise"),
                    isSabinoVision: themeName.includes("Tema Sabino Vision"),
                    isSplit: themeName.includes("Split"),
                    isWART: themeName.includes("WART"),
                    isVogal: themeName.includes("Vogal"),
                    isAurohra: themeName.includes("Aurohra 2.0"),
                    isRAWART: themeName.includes("RAWART")
                };

                return fixShopify || Object.values(themeChecks).some(Boolean);
            })();

            saveTrackingParams();
            processLinks();

            const originalWindowOpen = window.open;
            window.open = function(url, target, features) {
                const processedUrl = TrackingManager.addTrackingParams(url?.toString() || "");
                return originalWindowOpen(processedUrl, target || "", features || "");
            };

            if (!isShopifyTheme) {
                processForms();

                const observer = new MutationObserver((mutations, observer) => {
                    const hasNewInputs = mutations.some(mutation =>
                        Array.from(mutation.addedNodes).some(node =>
                            node.nodeType === Node.ELEMENT_NODE &&
                            node.tagName === "INPUT" &&
                            node.type === "hidden"
                        )
                    );

                    if (!hasNewInputs) {
                        processLinks(true);
                        processForms(true);
                    }
                });

                observer.observe(document.body, {
                    subtree: true,
                    childList: true
                });
            }

            if (!config.ignoreAllIframes &&
                !document.querySelector('link[href="https://api.vturb.com.br"]')) {
                document.querySelectorAll("iframe").forEach(iframe => {
                    const shouldIgnore =
                        Object.values(vendors.VideoPlatforms).some(domain => iframe.src.includes(domain)) ||
                        config.ignoreClasses.some(className => iframe.classList.contains(className));

                    if (!shouldIgnore) {
                        iframe.src = TrackingManager.addTrackingParams(iframe.src);
                    }
                });
            }
        }

        function startTrackingWithRetry() {
            initializeTracking();

            if (!config.ignoreRetry) {
                setTimeout(initializeTracking, 2000);
                setTimeout(initializeTracking, 3000);
                setTimeout(initializeTracking, 5000);
                setTimeout(initializeTracking, 9000);
            }
        }

        if (config.fastInit || document.readyState === "complete") {
            startTrackingWithRetry();
        } else {
            window.addEventListener("load", startTrackingWithRetry);
        }
    })();
})();