import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import managementApi from '../../../api/admin/managementApi';
import Constants from '../../../constants/constants';
import ModalConfirmDeleteUser from './modal_confirm_delete_user';
import { Link } from "react-router-dom";

function ListUser(props) {
    const [user, setUser] = useState({});
    const [renderTable, setRenderTable] = useState();

    const [limit, setLimit] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState();


    const listUser = () => {
        managementApi.getUser().then((response) => {
            let mounted = true;
            if (mounted) {
                if (response.status = Constants.HTTP_STATUS.OK) {
                    const slice = response.data.users.slice(page - 1, page - 1 + limit);
                    setUser(slice);
                    setPageCount(Math.ceil(response.data.users.length / limit))
                }
            }
        }, (error) => {
            props.history.push(Constants.LINK_URL.ERROR);
        });
    }

    useEffect(() => {
        listUser();
    }, [page,limit])
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setPage(selectedPage + 1)
    };
    const changeLimit = (e) =>{
        const limit = +e.target.value;
        setLimit(limit);
    }

    const [modalConfirmDeleteUser, setModalConfirmDeleteUser] = useState(false);
    const toggleModalConfirmDeleteUser = (e) => {
        const userId = e.target.dataset.id;
        setUserId(userId);
        setModalConfirmDeleteUser(!modalConfirmDeleteUser);
    };

    useEffect(() => {
        if (user.length > 0) {
            setRenderTable(user.map(item => (
                <tr key={item.id}>
                    <td>{user.indexOf(item)+1}</td>
                    <td><Link className="text-secondary" to={`${Constants.LINK_URL.USER_INFO}?user_id=${item.id}`}>{item.fullname}</Link></td>
                    <td><Link className="text-secondary" to={`${Constants.LINK_URL.USER_INFO}?user_id=${item.id}`}><img src={"http://localhost:8888/backend-web/public" + (item.image ? item.image: '/local/default.png')} alt="organization" className="thumb-md round-img"/></Link></td>
                    <td>{item.position}</td>
                    <td><Link to={`${Constants.LINK_URL.USER_INFO}?user_id=${item.id}`}><i className="fa fa-info m-r-5 text-info cell-click font-20" data-id={item.id}></i></Link> <i className="fa fa-minus-circle m-l-5 text-danger cell-click font-20" data-id={item.id} onClick={toggleModalConfirmDeleteUser}></i></td>
                </tr>
            )));
        }
    }, [user]);
    useEffect(() => {
        listUser();
    }, []);
    return (
        <>
            <h4 className="card-title">Danh sách cá nhân</h4>
            <div style={{width:'200px'}}>
                <select className="form-control" onChange={changeLimit} value={limit}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div className="table-responsive m-t-10">
                <table className="table table-bordered table-striped text-center table-management">
                    <thead>
                        <tr className="text-center">
                            <th className="cell-click">STT</th>
                            <th className="cell-click">Cá nhân</th>
                            <th className="cell-click">Ảnh</th>
                            <th className="cell-click">Vị trí</th>
                            <th className="cell-click">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTable}
                    </tbody>
                </table>
                {pageCount > 1 && <div className="d-flex justify-content-center">
                <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />
                </div> }
            </div>
            <ModalConfirmDeleteUser
            modal={modalConfirmDeleteUser}
            toggle={toggleModalConfirmDeleteUser}
            id={userId}/>
        </>
    );
}
export default ListUser;