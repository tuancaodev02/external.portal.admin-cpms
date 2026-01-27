'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const ReportsComponent = () => {
    const hostRef = useRef<HTMLDivElement>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

    useEffect(() => {
        if (hostRef.current && !hostRef.current.shadowRoot) {
            const shadow = hostRef.current.attachShadow({ mode: 'open' });
            setShadowRoot(shadow);
        }
    }, []);

    return (
        <div ref={hostRef} style={{ width: '100%', height: '100vh' }}>
            {shadowRoot &&
                createPortal(
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            margin: 0,
                            padding: 0,
                            overflow: 'hidden',
                        }}
                    >
                        <iframe
                            title="Power BI Dashboard - QLLT"
                            src="https://app.powerbi.com/reportEmbed?reportId=5e9ccf16-2cf7-4c3c-8ef4-84163697c72f&autoAuth=true&ctid=2dff09ac-2b3b-4182-9953-2b548e0d0b39&filterPaneEnabled=false&navContentPaneEnabled=false"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen={true}
                            style={{ border: 'none' }}
                        />
                    </div>,
                    shadowRoot as unknown as Element,
                )}
        </div>
    );
};

export default ReportsComponent;
