import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../store/slices/ui';
import orderService from '../../services/orderService';
import * as S from '../Settings/DependentBase';

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Status = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
  
  ${props => {
    switch (props.status?.toLowerCase()) {
      case 'processing':
        return 'color: #b45309; background: #fef3c7;';
      case 'confirmed':
        return 'color: #0369a1; background: #cffafe;';
      case 'shipped':
        return 'color: #7c3aed; background: #ede9fe;';
      case 'delivered':
        return 'color: #15803d; background: #dcfce7;';
      case 'cancelled':
        return 'color: #b91c1c; background: #fee2e2;';
      default:
        return 'color: #6b7280; background: #f3f4f6;';
    }
  }}
`;

const ItemsList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #374151;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #6b7280;
  padding: 24px 8px;
`;

const DependentOrders = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalOrders: 0, hasMore: false });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const [storeCode, setStoreCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        dispatch(showLoading({ message: 'Loading your orders…' }));
        const res = await orderService.list({ page, limit, status: status || undefined });
        if (!mounted) return;
        const list = res?.data?.orders || [];
        setOrders(list);
        setPagination(res?.data?.pagination || { currentPage: page, totalPages: 1, totalOrders: list.length, hasMore: false });
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || 'Something went wrong fetching orders');
        setOrders([]);
      } finally {
        if (mounted) setLoading(false);
        dispatch(hideLoading());
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, [page, limit, status]);

  const openDetails = async (id) => {
    try {
      dispatch(showLoading({ message: 'Loading order details…' }));
      setDetailOrder(null);
      const res = await orderService.getById(id);
      setDetailOrder(res?.data);
      setDetailsOpen(true);
    } catch (e) {
      setError(e?.message || 'Failed to load order details');
    } finally {
      dispatch(hideLoading());
    }
  };

  const cancelOrder = async (id) => {
    try {
      dispatch(showLoading({ message: 'Cancelling order…' }));
      await orderService.cancel(id);
      // Refresh list
      const res = await orderService.list({ page, limit, status: status || undefined });
      setOrders(res?.data?.orders || []);
      setPagination(res?.data?.pagination || pagination);
    } catch (e) {
      setError(e?.message || 'Failed to cancel order');
    } finally {
      dispatch(hideLoading());
    }
  };

  const verifyStoreCode = async () => {
    if (!storeCode?.trim()) return;
    try {
      setVerifyResult(null);
      dispatch(showLoading({ message: 'Verifying store code…' }));
      const res = await orderService.verifyStore(storeCode.trim());
      setVerifyResult(res?.data || { message: 'Verified' });
    } catch (e) {
      setVerifyResult({ error: e?.message || 'Verification failed' });
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <S.ScrollableContainer>
      <S.SettingsHeader>
        <h1>Orders</h1>
        <p>Track your purchases and delivery status</p>
      </S.SettingsHeader>

      <S.SettingsCard>
        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <label style={{ color: '#374151' }}>Status:</label>
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="">All</option>
            <option value="processing">Processing</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 12 }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>

        {/* Store code verification */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Enter store verification code"
            value={storeCode}
            onChange={(e) => setStoreCode(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', flex: '1 1 280px' }}
          />
          <button onClick={verifyStoreCode} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Verify</button>
          {verifyResult && (
            <div style={{ color: verifyResult.error ? '#b91c1c' : '#065f46' }}>
              {verifyResult.error ? verifyResult.error : (verifyResult.message || 'Valid code')}
            </div>
          )}
        </div>

        {loading && <p>Loading orders…</p>}
        {!loading && error && (
          <div style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</div>
        )}

        {!loading && !error && orders?.length === 0 && (
          <EmptyState>No orders yet.</EmptyState>
        )}

        {!loading && !error && orders?.length > 0 && (
          <OrdersList>
            {orders.map((order) => {
              const id = order?.id || order?._id || order?.reference || '—';
              const createdAt = order?.createdAt || order?.date || order?.created_at;
              const when = createdAt ? new Date(createdAt).toLocaleString() : '—';
              const statusText = order?.orderStatus || order?.status || 'pending';
              const total = parseFloat(order?.totalAmount || order?.total || 0);
              const items = order?.items || order?.orderItems || order?.products || [];
              return (
                <OrderCard key={id}>
                  <OrderHeader>
                    <div>
                      <strong>Order #{String(id).slice(-6)}</strong>
                      <div style={{ color: '#6b7280', fontSize: 12 }}>Placed {when}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Status status={statusText}>{String(statusText).toLowerCase()}</Status>
                      <div style={{ fontWeight: 600 }}>R{Number(total || 0).toFixed(2)}</div>
                    </div>
                  </OrderHeader>

                  {items?.length > 0 ? (
                    <ItemsList>
                      {items.map((it, idx) => (
                        <li key={it?.id || it?._id || idx}>
                          {(it?.product?.name || it?.name || it?.productName || 'Item')} x{it?.quantity || 1} {it?.price && `— R${Number(it.price).toFixed(2)}`}
                        </li>
                      ))}
                    </ItemsList>
                  ) : (
                    <div style={{ color: '#6b7280' }}>No item details available.</div>
                  )}

                  <div style={{ paddingTop: 8, borderTop: '1px solid #e5e7eb', marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Total Amount:</strong>
                    <strong style={{ fontSize: 16, color: '#185c37' }}>R{Number(total || 0).toFixed(2)}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => openDetails(id)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>View details</button>
                    {String(statusText).toLowerCase() === 'processing' && (
                      <button onClick={() => cancelOrder(id)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #b91c1c', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer' }}>Cancel order</button>
                    )}
                  </div>
                </OrderCard>
              );
            })}
          </OrdersList>
        )}

        {/* Pagination controls */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16 }}>
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
            <button disabled={!pagination.hasMore && page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: (!pagination.hasMore && page >= pagination.totalPages) ? 'not-allowed' : 'pointer' }}>Next</button>
          </div>
        )}
      </S.SettingsCard>

      {/* Details Modal */}
      {detailsOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: '90%', maxWidth: 640, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <h3 style={{ margin: 0 }}>Order Details</h3>
              <button onClick={() => { setDetailsOpen(false); setDetailOrder(null); }} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              {!detailOrder ? (
                <p>Loading…</p>
              ) : (
                <div>
                  <p><strong>Order #</strong> {String(detailOrder.id).slice(-6)}</p>
                  <p><strong>Status:</strong> {detailOrder.orderStatus}</p>
                  <p><strong>Total:</strong> R{Number(detailOrder.totalAmount || 0).toFixed(2)}</p>
                  {(
                    detailOrder.storeInstructions?.code || detailOrder.storeCode
                  ) && (
                    <p><strong>Store Code:</strong> {detailOrder.storeInstructions?.code || detailOrder.storeCode}</p>
                  )}
                  <h4>Items</h4>
                  <ul>
                    {(detailOrder.orderItems || detailOrder.items || []).map((it) => {
                      // Try multiple price sources for persistence
                      const price = it.price || it.subtotal / (it.quantity || 1) || 0;
                      const subtotal = it.subtotal || (price * (it.quantity || 1)) || 0;
                      return (
                        <li key={it.id || it._id}>
                          {(it.displayProduct?.name || it.product?.name || it.productName || 'Item')} ×{it.quantity || 1}
                          {price > 0 && (
                            <>
                              {' — '}
                              <strong>R{Number(price).toFixed(2)}</strong> each{' '}
                              {subtotal > 0 && (
                                <>
                                  = <strong>R{Number(subtotal).toFixed(2)}</strong>
                                </>
                              )}
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </S.ScrollableContainer>
  );
};

export default DependentOrders;
