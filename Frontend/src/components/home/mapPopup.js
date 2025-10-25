'use client';

import { useEffect, useRef } from 'react';

const mapPopup = ({ bike, onMount }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && onMount) {
            onMount(containerRef.current);
        }
    }, [onMount]);

    const handleBookClick = async (e) => {
        e.preventDefault();

        //   // Example fetch to backend endpoint (uncomment & adapt URL when ready)
        //   /*
        //   try {
        //     const res = await fetch('/api/book', {
        //       method: 'POST',
        //       headers: { 'Content-Type': 'application/json' },
        //       body: JSON.stringify({ bikeId: bike.id })
        //     });
        //     const data = await res.json();
        //     console.log('booking response', data);
        //   } catch (err) {
        //     console.error('booking failed', err);
        //   }
        //   */

        console.log('Book button clicked for bike', bike.id);
    };

    return (
        <div ref={containerRef} style={{ textAlign: 'center', padding: '8px' }}>
            <div>
                <strong>Bike #{bike.id}</strong>
            </div>
            <div
                style={{
                    margin: '6px 0',
                    color: bike.available ? '#16a34a' : '#dc2626'
                }}
            >
                {bike.available ? 'Available' : 'In Use'}
            </div>
            <button
                onClick={handleBookClick}
                disabled={!bike.available}
                style={{
                    background: 'green',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: bike.available ? 'pointer' : 'not-allowed',
                    opacity: bike.available ? '1' : '0.6'
                }}
            >
                book
            </button>
        </div>
    );
}

export default mapPopup;