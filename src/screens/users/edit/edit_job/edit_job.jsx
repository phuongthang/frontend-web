import React, { useEffect, useState } from 'react';
import DistrictApi from '../../../../api/address/getDistrictApi';
import ProvinceApi from '../../../../api/address/getProvinceApi';
import WardApi from '../../../../api/address/getWardApi';
import ExperienceApi from '../../../../api/common/experienceApi';
import LanguageApi from '../../../../api/common/languageApi';
import TypeApi from '../../../../api/common/typeApi';
import jobApi from '../../../../api/organization/jobApi';
import Constants from '../../../../constants/constants';
import { getInfoUserLogin, queryString } from '../../../../helpers/helpers';
import MainLayout from '../../../layouts/main_layout';
import LoadingOverlay from '../../../loading/loading_overlay';
import ModalFail from '../../../modal/modal_fail';
import ModalSuccess from '../../../modal/modal_success';

function EditJob(props) {

    const userData = getInfoUserLogin();
    const parameters = {
        organization_id:userData.id,
        id: queryString('id'),
    }
    const [job, setJob] = useState({
        id : '',
        title: '',
        organization_id: '',
        start_date: '',
        end_date: '',
        position: '',
        salary: '',
        language_id: '',
        description: '',
        location: '',
        required: '',
        count: '',
        province: 0,
        district: 0,
        ward: 0,
        type_id: '',
        experience_id: ''
    });
    const handleChange = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        setJob((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue,
        }));
    }
    const [renderProvince, setRenderProvince] = useState();
    const [renderDistrict, setRenderDistrict] = useState();
    const [renderWard, setRenderWard] = useState();
    const [renderLanguage, setRenderLanguage] = useState();
    const [renderExperience, setRenderExperience] = useState();
    const [renderType, setRenderType] = useState();
    const [isSubmit, setIsSubmit] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const toggleModalSuccess = () => {
        setModalSuccess(!modalSuccess);
    };
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [modalFail, setModalFail] = useState(false);
    const toggleModalFail = () => {
        setModalFail(!modalFail);
    };

    const editJob = (id)=>{
        jobApi.editJob({id:id}).then((response)=>{
            if(response.status === Constants.HTTP_STATUS.OK){
                setJob(response.data.jobs);
            }
        },(error)=>{
            props.history.push(Constants.LINK_URL.ERROR);
        });
    }
    const getProvinceApi = () => {
        ProvinceApi.getProvinceApi().then((response) => {
            if (response.status === Constants.HTTP_STATUS.OK) {
                setRenderProvince(response.data.province.map(item => (
                    <option key={item.id} value={item.id}>{item._name}</option>
                )));
            }
        }, (error) => {
            props.history.push(Constants.LINK_URL.ERROR);
        });
    }

    useEffect(() => {
        if (job.province !== 0) {
            DistrictApi.getDistrictApi(job.province).then((response) => {
                if (response.status === Constants.HTTP_STATUS.OK) {
                    setRenderDistrict(response.data.district.map(item => (
                        <option key={item.id} value={item.id}>{item._name}</option>
                    )));
                }
            }, (error) => {
                props.history.push(Constants.LINK_URL.ERROR);
            })
        }
    }, [job.province])

    useEffect(() => {
        if (job.district !== 0) {
            WardApi.getWardApi(job.district).then((response) => {
                if (response.status === Constants.HTTP_STATUS.OK) {
                    setRenderWard(response.data.ward.map(item => (
                        <option key={item.id} value={item.id}>{item._name}</option>
                    )));
                }
            }, (error) => {
                props.history.push(Constants.LINK_URL.ERROR);
            })
        }
    }, [job.district]);
    const updateJob = (params) => {
        jobApi.updateJob(params).then((response) => {
            if (response.status === Constants.HTTP_STATUS.OK) {
                setLoadingOverlay(false);
                toggleModalSuccess();
                setDisableSubmit(true);
            }

        }, (error) => {
            setLoadingOverlay(false);
            toggleModalFail();
            setDisableSubmit(false);
        });
    }
    useEffect(() => {
        if (isSubmit && !disableSubmit) {
            const params = {
                id: parameters.id,
                title: job.title,
                organization_id: parameters.organization_id,
                start_date: job.start_date,
                end_date: job.end_date,
                position: job.position,
                salary: job.salary,
                language: job.language_id,
                description: job.description,
                location: job.location,
                required: job.required,
                count: job.count,
                province: job.province,
                district: job.district,
                ward: job.ward,
                type:job.type_id,
                experience:job.experience_id

            }
            setLoadingOverlay(true);
            updateJob(params);
        }
    }, [isSubmit]);
    const getLanguageApi = () => {
        LanguageApi.getLanguageApi().then((response) => {
            if (response.status === Constants.HTTP_STATUS.OK) {
                setRenderLanguage(response.data.languages.map(item => (
                    <option key={item.id} value={item.id}>{item.language}</option>
                )));
            }
        }, (error) => {
            props.history.push(Constants.LINK_URL.ERROR);
        });
    }
    console.log(job);
    const getExperienceApi = () => {
        ExperienceApi.getExperienceApi().then((response) => {
                if (response.status === Constants.HTTP_STATUS.OK) {
                    setRenderExperience(response.data.experiences.map(item => (
                        <option key={item.id} value={item.id}>{item.experience}</option>
                    )));
                }
        }, (error) => {
            props.history.push(Constants.LINK_URL.ERROR);
        });
    }

    const getTypeApi = () => {
        TypeApi.getTypeApi().then((response) => {
            if (response.status === Constants.HTTP_STATUS.OK) {
                setRenderType(response.data.types.map(item => (
                    <option key={item.id} value={item.id}>{item.type}</option>
                )));
            }
        }, (error) => {
            props.history.push(Constants.LINK_URL.ERROR);
        });
    }

    useEffect(() => {
        document.title = "Công việc";
        getExperienceApi();
        getLanguageApi();
        getTypeApi();
        getProvinceApi();
        editJob(parameters.id);
    }, []);
    return (
        <MainLayout>
            <div className="row page-titles">
                <div className="col-md-5 align-self-center">
                    <h3>Công việc</h3>
                </div>
                <div className="col-md-7 align-self-center">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Trang chủ</a></li>
                        <li className="breadcrumb-item">Công việc</li>
                        <li className="breadcrumb-item active">Chỉnh sửa</li>
                    </ol>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card card-outline-info">
                            <div className="card-header">
                                <h4 className="m-b-0">Chỉnh sửa công việc</h4>
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="form-body">
                                        <div className="row p-t-20">
                                            <div className="col-md-12">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Công việc :</label>
                                                    <input type="text" className="form-control" required name="title" onChange={handleChange} value={job.title} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Ngày bắt đầu :</label>
                                                    <input type="date" className="form-control" required name="start_date" onChange={handleChange} value={job.start_date} />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Ngày kết thúc :</label>
                                                    <input type="date" className="form-control" required name="end_date" onChange={handleChange} value={job.end_date}/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Vị trí :</label>
                                                    <input className="form-control" required name="position" onChange={handleChange} value={job.position} />
                                                    <small className="form-control-feedback"> ex : Backend Developer </small></div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Trình độ :</label>
                                                    <select name="experience_id" id="experience" className="form-control" onChange={handleChange} value={job.experience_id}>
                                                        {
                                                            renderExperience
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Thành phố :</label>
                                                    <select name="province" id="province" className="form-control" onChange={handleChange} value={job.province}>
                                                        <option defaultValue>Chọn Thành phố</option>
                                                        {
                                                            renderProvince
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Quận/Huyện :</label>
                                                    <select name="district" id="district" className="form-control" onChange={handleChange} value={job.district}>
                                                        <option defaultValue>Chọn Quận/Huyện</option>
                                                        {
                                                            renderDistrict
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Xã/Thị trấn :</label>
                                                    <select name="ward" id="ward" className="form-control" onChange={handleChange} value={job.ward}>
                                                        <option defaultValue>Chọn Xã/Thị trấn</option>
                                                        {
                                                            renderWard
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Địa chỉ :</label>
                                                    <input type="text" name="location" className="form-control" onChange={handleChange} value={job.location} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Loại công việc :</label>
                                                    <select name="type_id" id="type" className="form-control" onChange={handleChange} value={job.type_id}>
                                                        {
                                                            renderType
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Lương :</label>
                                                    <input className="form-control" required name="salary" onChange={handleChange} value={job.salary} />
                                                    <small className="form-control-feedback"> ex : 1000 USD </small>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Ngôn ngữ :</label>
                                                    <select name="language_id" id="language" className="form-control" onChange={handleChange} value={job.language_id}>
                                                        {
                                                            renderLanguage
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label" >Số lượng :</label>
                                                    <input name="count" type="number" className="form-control" min={1} required onChange={handleChange} value={job.count} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label" >Mô tả :</label>
                                                    <textarea className="form-control" rows={10} required name="description" onChange={handleChange} value={job.description} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group has-secondary">
                                                    <label className="control-label">Yêu cầu :</label>
                                                    <textarea className="form-control" rows={10} required name="required" onChange={handleChange} value={job.required} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center box-action">
                                            <button type="button" className="btn btn-info m-r-10" onClick={() => setIsSubmit(true)} disabled={disableSubmit ? true : false} >Chỉnh sửa</button>
                                            <button type="button" className="btn btn-danger"> Hủy</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalSuccess toggle={toggleModalSuccess} modal={modalSuccess} text={"Cập nhật thành công !"} />
            <ModalFail toggle={toggleModalFail} modal={modalFail} />
            {loadingOverlay && <LoadingOverlay/>}
        </MainLayout>
    );
}
export default EditJob;