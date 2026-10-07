const { Op } = require("sequelize");

const { IncentiveForms, sequelize } = require("../../models");
const { incentiveFormsValidator } = require("../incentive_forms/incentive_forms_validator")
const { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, PRECONDITION_FAILED } = require('../../constants/http/status_codes');


const IncentiveFormsController = {
    create: async (req, res) => {
        const matched = incentiveFormsValidator(req.body, res).validate()

        if (!matched) {
            res.status(PRECONDITION_FAILED).json({ message: 'IncentiveForms required' });
        }

        await sequelize.transaction(async (t) => {
            try {
                const incentiveFormss = await IncentiveForms.create({
                    name_of_authors: req.body.name_of_authors,
                    email_address: req.body.email_address,
                    contact_number: req.body.contact_number,
                    incentive_type_id: req.body.incentive_type_id,
                    submission_date: req.body.submission_date,
                    publisher_info: req.body.publisher_info,
                    title_of_work: req.body.title_of_work,
                    publication_date: req.body.publication_date,
                    citation_date: req.body.citation_date,
                    citation_no: req.body.citation_no,
                    isbn: req.body.isbn,
                    peer_review_proof_id: req.body.peer_review_proof_id,
                    created_by: req.user.id,
                    created_at: new Date(Date.now()).toISOString(),
                },
                    { transaction: t }
                );
                res.status(CREATED).json({ IncentiveForms: incentiveFormss, Message: 'IncentiveForms entry created.' });
            } catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
            }
        });
    },

    all: async (req, res) => {
        await sequelize.transaction(async (t) => {
            try {
                const incentiveFormss = await IncentiveForms.findAll({
                    attributes: ['name_of_authors', 'email_address', 'contact_number', 'incentive_type_id', 'submission_date', 'publisher_info', 'title_of_work', 'publication_date', 'citation_date', 'citation_no', 'isbn', 'peer_review_proof_id', ['created_by', 'user_account_id']],
                    include: [
                        {
                            model: sequelize.models.SIncentiveTypes,
                            attributes: ['name'],
                        },
                        {
                            model: sequelize.models.SPeerReviewProof,
                            attributes: ['name'],
                        },
                        {
                            model: sequelize.models.CAttachmentInfos,
                            attributes: ['attachment_file'],
                            include: [
                                {
                                    model: sequelize.models.SAttachmentInfos,
                                    attributes: ['name'],
                                }
                            ]
                        }
                    ],
                });
                res.status(OK).json({ IncentiveForms: incentiveFormss });
            } catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
            }
        });
    },

    // where: {id: req.params.id},
    get: async (req, res) => {
        await sequelize.transaction(async (t) => {
            try {
                const incentiveFormss = await IncentiveForms.findAll({
                    attributes: ['name_of_authors', 'email_address', 'contact_number', 'incentive_type_id', 'submission_date', 'publisher_info', 'title_of_work', 'publication_date', 'citation_date', 'citation_no', 'isbn', 'peer_review_proof_id',['created_by', 'user_account_id']],
                    where: {id: req.params.id},
                    include: [
                        {
                            model: sequelize.models.SIncentiveTypes,
                            attributes: ['name'],
                        },
                        {
                            model: sequelize.models.SPeerReviewProof,
                            attributes: ['name'],
                        },
                        {
                            model: sequelize.models.CAttachmentInfos,
                            attributes: ['attachment_file'],
                            include: [
                                {
                                    model: sequelize.models.SAttachmentInfos,
                                    attributes: ['name'],
                                }
                            ]
                        }
                    ],
                });

                res.status(OK).json({ IncentiveForms: incentiveFormss });
                return;
            } catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
                return;
            }
        });
    },

    getByUserId: async (req, res) => {
        await sequelize.transaction(async (t) => {
            try {
                const incentiveFormss = await IncentiveForms.findAll({
                    attributes: ['name_of_authors', 'email_address', 'contact_number', 'incentive_type_id', 'submission_date', 'publisher_info', 'title_of_work', 'publication_date', 'citation_date', 'citation_no', 'isbn', 'peer_review_proof_id', ['created_by', 'user_account_id']],
                    where: {created_by: req.user.id},
                    include: [
                        {
                            model: sequelize.models.SIncentiveTypes,
                            attributes: ['name'],
                        },
                        {
                            model: sequelize.models.SPeerReviewProof,
                            attributes: ['name'],
                        },
                        {
                            model: sequelize.models.CAttachmentInfos,
                            attributes: ['attachment_file'],
                            include: [
                                {
                                    model: sequelize.models.SAttachmentInfos,
                                    attributes: ['name'],
                                }
                            ]
                        }
                    ],
                });
                res.status(OK).json({ IncentiveForms: incentiveFormss });
                return;
            } catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
                return;
            }
        });
    },


    update: async (req, res) => {
        await sequelize.transaction(async (t) => {
            try {

                const incentiveFormss = await IncentiveForms.findOne(
                    {
                        where: {
                            id: req.params.id,
                        },
                    },
                );

                if (!incentiveFormss) {
                    res.status(NOT_FOUND).json({
                        Message: `No matching IncentiveForms entry with id ${req.params.id}`,
                    });
                    return;
                }

                await incentiveFormss.update({
                    name_of_authors: req.body.name_of_authors ? req.body.name_of_authors : incentiveFormss.name_of_authors,
                    email_address: req.body.email_address ? req.body.email_address : incentiveFormss.email_address,
                    contact_number: req.body.contact_number ? req.body.contact_number : incentiveFormss.contact_number,
                    incentive_type_id: req.body.incentive_type_id ? req.body.incentive_type_id : incentiveFormss.incentive_type_id,
                    submission_date: req.body.submission_date ? req.body.submission_date : incentiveFormss.submission_date,
                    publisher_info: req.body.publisher_info ? req.body.publisher_info : incentiveFormss.publisher_info,
                    title_of_work: req.body.title_of_work ? req.body.title_of_work : incentiveFormss.title_of_work,
                    publication_date: req.body.publication_date ? req.body.publication_date : incentiveFormss.publication_date,
                    citation_date: req.body.citation_date ? req.body.citation_date : incentiveFormss.citation_date,
                    citation_no: req.body.citation_no ? req.body.citation_no : incentiveFormss.citation_no,
                    isbn: req.body.isbn ? req.body.isbn : incentiveFormss.isbn,
                    peer_review_proof_id: req.body.peer_review_proof_id ? req.body.peer_review_proof_id : incentiveFormss.peer_review_proof_id,
                    updated_by: req.user.id,
                    updated_at: new Date(Date.now()).toISOString(),
                });

                res.status(OK).json({
                    IncentiveForms: incentiveFormss,
                    Message: "IncentiveForms entry updated.",
                });
                return;
            } catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
                return;
            }
        });
    },

    delete: async (req, res) => {
        await sequelize.transaction(async (t) => {
            try {
                const incentiveFormss = await IncentiveForms.findOne(
                    {
                        where: {
                            id: req.params.id,
                        },
                    },
                );

                if (!incentiveFormss) {
                    res.status(NOT_FOUND).json({
                        Message: `No matching IncentiveForms entry with id : ${req.params.id}`,
                    });

                    return;
                }
                await incentiveFormss.destroy({
                    force: false,
                    deleted_by: req.user.id,
                    deleted_at: new Date(Date.now()).toISOString(),
                });

                res.status(OK).json({
                    Message: `IncentiveForms entry Removed.`,
                });
                return;
            } catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
                return;
            }
        });
    },


};

module.exports.IncentiveFormsController = IncentiveFormsController;
