const Sk = ({ h, w, r }: { h: string; w?: string; r?: string }) => (
    <div className="skeleton" style={{ height: h, width: w ?? '100%', borderRadius: r ?? '6px', flexShrink: 0 }} />
)

const OrderDetailsSkeleton = () => {
    return (
        <div className="main-app-container">
            <div className="od">

                {/* Header Card */}
                <div className="od__header-card">
                    <div className="od__header-content">
                        <div className="od__header-icon">
                            <Sk h="40px" w="40px" r="50%" />
                        </div>
                        <div className="od__header-info" style={{ gap: '8px', display: 'flex', flexDirection: 'column' }}>
                            <Sk h="24px" w="120px" />
                            <Sk h="16px" w="180px" />
                        </div>
                    </div>
                    <div className="od__header-badges" style={{ gap: '8px', display: 'flex' }}>
                        <Sk h="28px" w="90px" r="20px" />
                        <Sk h="28px" w="70px" r="20px" />
                    </div>
                </div>

                {/* Payment Card */}
                <div className="od__card od__card--full" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Sk h="20px" w="160px" />
                    <Sk h="16px" w="100%" />
                    <Sk h="16px" w="80%" />
                    <Sk h="16px" w="90%" />
                </div>

                {/* 2-col grid */}
                <div className="od__cards-grid">
                    {/* Contact Card */}
                    <div className="od__card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <Sk h="20px" w="140px" />
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Sk h="20px" w="20px" r="50%" />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Sk h="12px" w="60px" />
                                    <Sk h="16px" w="140px" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Card */}
                    <div className="od__card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Sk h="20px" w="100px" />
                        <Sk h="80px" w="100%" r="8px" />
                    </div>
                </div>

                {/* Documents Card */}
                <div className="od__card od__card--full" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Sk h="20px" w="120px" />
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Sk h="24px" w="24px" r="50%" />
                                <Sk h="16px" w="100px" />
                                <Sk h="16px" w="80px" />
                            </div>
                            <Sk h="16px" w="50px" />
                        </div>
                    ))}
                </div>

                {/* Files Card */}
                <div className="od__card od__card--full" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Sk h="20px" w="80px" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                        {[1, 2].map(i => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Sk h="36px" w="36px" r="8px" />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <Sk h="14px" w="120px" />
                                    <Sk h="12px" w="60px" />
                                </div>
                                <Sk h="28px" w="28px" r="50%" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrderDetailsSkeleton;
